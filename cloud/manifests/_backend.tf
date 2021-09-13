terraform {
  required_version = ">= 0.14"
}

provider "aws" {
  region = var.aws_region
  profile = var.aws_profile
}

terraform {
  backend "s3" {}
}

resource "random_id" "name_suffix" {
  byte_length = 4
  keepers = {
    id = var.name_prefix
  }
}
