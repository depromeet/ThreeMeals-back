data "aws_iam_policy_document" "api_server_ec2" {
  statement {
    sid = ""

    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type = "Service"
      identifiers = [
        "ssm.amazonaws.com",
        "ec2.amazonaws.com",
      ]
    }

    effect = "Allow"
  }
}

resource "aws_eip" "api_server_eip" {
  vpc   = true

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name    = "${var.name_prefix}-api-server-eip-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

resource "aws_iam_role" "api_server_ec2_role" {
  name               = "${var.name_prefix}-api-server-ec2-role-${random_id.name_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.api_server_ec2.json

  tags = {
    Name    = "${var.name_prefix}-api_server-ec2-role-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

resource "aws_iam_role_policy_attachment" "api_server_cloudwatch_agent_server_policy" {
  role       = aws_iam_role.api_server_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "api_server_ssm_policy" {
  role       = aws_iam_role.api_server_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "api_server_ec2_instance_profile" {
  name = "${var.name_prefix}-api-server-ec2-profile"
  role = aws_iam_role.api_server_ec2_role.name
}

resource "aws_security_group" "api_server_sg" {
  name   = "${var.name_prefix}-api-server-sg-${random_id.name_suffix.hex}"
  vpc_id = aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All traffic"
  }

  tags = {
    Name    = "${var.name_prefix}-api-server-sg-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

data "aws_ami" "api_server_amazon_linux_2" {
  most_recent = true

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }


  filter {
    name   = "name"
    values = ["amzn2-ami-hvm*"]
  }

  owners = ["amazon"]
}

locals {
  api_server_instance_name = "${var.name_prefix}-api-server-${random_id.name_suffix.hex}"
}
resource "aws_instance" "api_server_instance" {
  ami           = var.api_server_ami == null ? data.aws_ami.api_server_amazon_linux_2.id : var.api_server_ami
  instance_type = var.api_server_instance_type
  key_name      = var.api_server_instance_key_name


  availability_zone = element(aws_subnet.public.*.availability_zone, 0)
  subnet_id         = element(aws_subnet.public.*.id, 0)

  vpc_security_group_ids = [
    aws_security_group.api_server_sg.id,
  ]

  iam_instance_profile        = aws_iam_instance_profile.api_server_ec2_instance_profile.name
  associate_public_ip_address = true

  user_data_base64 = var.user_data_script == null ? null : base64encode(templatefile("${path.module}/script/${var.user_data_script}", {}))

  tags = {
    Name    = local.api_server_instance_name
    Project = var.project
  }
}

# ECR Registry
data "aws_iam_policy_document" "hush_api_server_ecr_permissions" {
  statement {
    sid = "AllowECROperationsOnHushApiServer"
    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "hush_api_server_ecr_permissions" {
  name   = "${var.project}-api-server-ecr-policy"
  policy = data.aws_iam_policy_document.hush_api_server_ecr_permissions.json
  role   = aws_iam_role.api_server_ec2_role.id
}

# S3 bucket
resource "aws_s3_bucket" "s3_hush_public" {
  bucket = "${var.name_prefix}-public"
  acl    = "private"

  force_destroy = var.s3_hush_public_read_force_destroy

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name    = "${var.name_prefix}-public"
    Project = var.project
  }
}

resource "aws_s3_bucket_public_access_block" "s3_hush_public_access_block" {
  bucket = aws_s3_bucket.s3_hush_public.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "s3_hush_public_read_policy" {
  statement {
    sid    = "PublicRead"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    resources = [
      "${aws_s3_bucket.s3_hush_public.arn}/**"
    ]
    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion"
    ]
  }
}

resource "aws_s3_bucket_policy" "s3_hush_public_policy" {
  bucket = aws_s3_bucket.s3_hush_public.id
  policy = data.aws_iam_policy_document.s3_hush_public_read_policy.json
}

data "aws_iam_policy_document" "hush_api_server_ec2_default_s3_permissions" {
  statement {
    sid = "AllowS3OperationsOnHushApiServer"
    actions = [
      "s3:ListAllMyBuckets",
      "s3:GetBucketLocation",
      "s3:PutObject",
      "s3:GetObject",
    ]
    resources = [
      "${aws_s3_bucket.s3_hush_public.arn}/**",
      "${aws_s3_bucket.s3_hush_api_server_cicd_builds.arn}/**",
    ]
  }
}

resource "aws_iam_role_policy" "hush_api_server_ec2_default_s3_policy" {
  name   = "${var.project}-api-server-s3-policy"
  policy = data.aws_iam_policy_document.hush_api_server_ec2_default_s3_permissions.json
  role   = aws_iam_role.api_server_ec2_role.id
}
