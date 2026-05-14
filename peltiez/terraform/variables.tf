variable "aws_region" {
  type        = string
  description = "AWS region for regional resources (Lambda, API Gateway, S3). CloudFront TLS certs for custom domains must be in us-east-1."
  default     = "eu-west-3"
}

variable "project" {
  type        = string
  description = "Short name prefix for resource names."
}

variable "domain" {
  type        = string
  description = "Optional custom domain for CloudFront (e.g. www.example.com). Leave empty to use only *.cloudfront.net."
  default     = ""
}

variable "certificate_arn" {
  type        = string
  description = "Optional ACM certificate ARN in us-east-1 for the custom domain. Leave empty to use the default CloudFront certificate."
  default     = ""
}

variable "lambda_s3_bucket" {
  type        = string
  description = "S3 bucket containing the Lambda deployment package (zip)."
}

variable "lambda_s3_key" {
  type        = string
  description = "S3 object key for the Lambda zip (e.g. dist/lambda-ab.zip)."
}

variable "event_collector_url" {
  type        = string
  description = "Optional URL for assignment/conversion events (Lambda env EVENT_COLLECTOR_URL)."
  default     = ""
}

variable "assign_prob_control" {
  type        = string
  description = "Fraction assigned to control as a decimal string, e.g. \"0.95\" (Lambda env ASSIGN_PROB_CONTROL; see lambda/ab-lambda.js)."
  default     = "0.5"
}
