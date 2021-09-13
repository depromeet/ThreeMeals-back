# Parameter Group
resource "aws_db_parameter_group" "hush_pg" {
  name = "${var.name_prefix}-parameter-group-${random_id.name_suffix.hex}"
  description = "The parameter group for ${var.project}"

  family = var.hush_rds_parameter_group_family
}

resource "aws_db_option_group" "hush_option_group" {
  name = "${var.name_prefix}-option-group-${random_id.name_suffix.hex}"
  engine_name = var.hush_rds_engine
  major_engine_version = var.hush_rds_engine_version
}

# DB security Group
resource "aws_db_subnet_group" "hush_rds_subnet_group" {
  name        = "${var.project}-dbsubnet-group-${random_id.name_suffix.hex}"
  description = "The subnets used for ${var.project} RDS deployments"

  subnet_ids = aws_subnet.private_db.*.id

  tags = {
    Name    = "${var.name_prefix}-dbsubnets-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

resource "aws_security_group" "hush_rds_security_group" {
  name        = "${var.project}-rds-sg-${random_id.name_suffix.hex}"
  description = "${var.project} ${var.hush_rds_engine} security group"
  vpc_id      = aws_vpc.default.id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name    = "${var.name_prefix}-rds-security-group-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

resource "aws_security_group_rule" "hush_rds_sg_egress_all" {
  security_group_id = aws_security_group.hush_rds_security_group.id
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  type              = "egress"
}

resource "aws_security_group_rule" "hush_rds_sg_ingress" {
  security_group_id = aws_security_group.hush_rds_security_group.id
  from_port         = var.hush_rds_port
  to_port           = var.hush_rds_port
  protocol          = "tcp"
  cidr_blocks       = ["10.${var.cidr_numeral}.0.0/16"]
  type              = "ingress"
  description       = "the ingress of security group"
}
