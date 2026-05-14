output "frontend_bucket" {
  description = "S3 bucket name for the static CirculAI φ frontend."
  value       = aws_s3_bucket.frontend.id
}

# Alias for docs / CI (same bucket as `frontend_bucket`).
output "static_bucket_name" {
  description = "Same as frontend_bucket (sync `public/circulai-phi/` here)."
  value       = aws_s3_bucket.frontend.id
}

output "site_access_logs_bucket" {
  description = "S3 bucket receiving server access logs for the frontend bucket."
  value       = aws_s3_bucket.frontend_access_logs.id
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name (HTTPS)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_domain_name" {
  description = "Alias of cloudfront_domain (hostname)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)."
  value       = aws_cloudfront_distribution.site.id
}

output "api_endpoint" {
  description = "Public HTTPS URL for the A/B assignment Lambda (API Gateway HTTP API v2)."
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "http_api_endpoint" {
  description = "Alias of api_endpoint (invoke URL)."
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "lambda_function_name" {
  description = "Deployed Lambda function name."
  value       = aws_lambda_function.ab.function_name
}

output "lambda_function_arn" {
  description = "Deployed Lambda ARN."
  value       = aws_lambda_function.ab.arn
}
