resource "aws_codedeploy_app" "hush_api_server_deploy" {
  compute_platform = "Server"
  name   = "${var.name_prefix}-api-server-code-deploy"
}
resource "aws_iam_role" "hush_api_server_deploy_role" {
  name   = "${var.name_prefix}-api-server-code-deploy-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "hush_api_server_deploy_role" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = aws_iam_role.hush_api_server_deploy_role.name
}

resource "aws_codedeploy_deployment_config" "hush_api_server_deployment_config" {
  compute_platform = "Server"
  deployment_config_name = "${var.name_prefix}-api-server-code-deployment-config"

  minimum_healthy_hosts {
    type  = "HOST_COUNT"
    value = 1
  }
}

resource "aws_codedeploy_deployment_group" "hush_api_server_deployment_group" {
  app_name              = aws_codedeploy_app.hush_api_server_deploy.name
  deployment_group_name = "${var.name_prefix}-api-server-code-deployment-group"
  service_role_arn      = aws_iam_role.hush_api_server_deploy_role.arn
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
//  deployment_config_name = aws_codedeploy_deployment_config.hush_api_server_deployment_config.id

  deployment_style {
    deployment_type = "IN_PLACE"
  }

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = local.api_server_instance_name
    }
  }
}

resource "aws_s3_bucket" "s3_hush_api_server_cicd_builds" {
  bucket = "${var.name_prefix}-cicd-builds"
  acl    = "private"
  force_destroy = true

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name    = "${var.name_prefix}-cicd-builds"
    Project = var.project
  }
}
