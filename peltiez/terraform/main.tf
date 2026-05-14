data "aws_caller_identity" "current" {}

# CloudFront → S3 : Origin Access Control (OAC, SigV4) remplace le schéma historique OAI ;
# accès objet uniquement via politique de bucket (pas d’ACL public-read).

# Managed-CachingOptimized — prefer data source over hardcoding the global policy ID.
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_s3_object" "lambda_zip" {
  bucket = var.lambda_s3_bucket
  key    = var.lambda_s3_key
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 2
}

resource "aws_iam_role" "lambda_ab" {
  name               = "${var.project}-circulai-phi-ab"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "lambda_ab_logs" {
  role       = aws_iam_role.lambda_ab.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "ab" {
  function_name = "${var.project}-circulai-phi-ab"
  role          = aws_iam_role.lambda_ab.arn
  handler       = "ab-lambda.handler"
  runtime       = "nodejs18.x"
  s3_bucket     = var.lambda_s3_bucket
  s3_key        = var.lambda_s3_key

  source_code_hash = data.aws_s3_object.lambda_zip.etag
  publish          = true
  timeout          = 10
  memory_size      = 256

  environment {
    variables = {
      EVENT_COLLECTOR_URL = var.event_collector_url
      ASSIGN_PROB_CONTROL = var.assign_prob_control
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_ab_logs]
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ab.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ab.execution_arn}/*/*"
}

resource "aws_apigatewayv2_api" "ab" {
  name          = "${var.project}-circulai-phi-ab"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "ab" {
  api_id           = aws_apigatewayv2_api.ab.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.ab.invoke_arn
  # HTTP API Lambda proxy: do not set integration_method (invalid for this integration type).
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.ab.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ab.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.ab.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project}-circulai-phi-web-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.project}-phi-oac"
  description                       = "OAC for CirculAI φ frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_iam_policy_document" "frontend_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontRead"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.frontend_bucket_policy.json
}

# Access logs (SSE-S3, private) — same account; `logging.s3.amazonaws.com` delivery.
resource "aws_s3_bucket" "frontend_access_logs" {
  bucket = "${var.project}-circulai-phi-web-logs-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "frontend_access_logs" {
  bucket                  = aws_s3_bucket.frontend_access_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "frontend_access_logs" {
  bucket = aws_s3_bucket.frontend_access_logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend_access_logs" {
  bucket = aws_s3_bucket.frontend_access_logs.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_access_logs" {
  bucket = aws_s3_bucket.frontend_access_logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3ServerAccessLogs"
        Effect = "Allow"
        Principal = {
          Service = "logging.s3.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.frontend_access_logs.arn}/*"
        Condition = {
          ArnLike = {
            "aws:SourceArn" = aws_s3_bucket.frontend.arn
          }
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_logging" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  target_bucket = aws_s3_bucket.frontend_access_logs.id
  target_prefix   = "s3-access/"

  depends_on = [
    aws_s3_bucket_policy.frontend_access_logs,
    aws_s3_bucket_public_access_block.frontend_access_logs,
  ]
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  default_root_object = "index.html"
  comment             = "${var.project} CirculAI φ frontend"
  aliases             = var.domain != "" ? [var.domain] : []

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "s3-frontend"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-frontend"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    # Managed-CachingOptimized (not deprecated forwarded_values).
    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  dynamic "viewer_certificate" {
    for_each = var.certificate_arn != "" ? ["acm"] : ["default"]
    content {
      cloudfront_default_certificate = viewer_certificate.value == "default" ? true : false
      acm_certificate_arn            = viewer_certificate.value == "acm" ? var.certificate_arn : null
      ssl_support_method             = viewer_certificate.value == "acm" ? "sni-only" : null
      minimum_protocol_version       = "TLSv1.2_2021"
    }
  }

  depends_on = [
    aws_s3_bucket_versioning.frontend,
    aws_s3_bucket_server_side_encryption_configuration.frontend,
  ]
}
