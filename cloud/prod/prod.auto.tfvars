aws_region  = "ap-northeast-2"
aws_profile = "hush_it_prod"
name_prefix = "hush-it-prod"

# VPC
cidr_numeral = 10
cidr_numeral_private_db = {
  "0" = "1"
  "1" = "2"
  "2" = "3"
}
cidr_numeral_private = {
}
cidr_numeral_public = {
  "0" = "10"
  "1" = "11"
  "2" = "12"
}
private_db_availability_zones   = ["ap-northeast-2a", "ap-northeast-2c", "ap-northeast-2b"]
public_availability_zones       = ["ap-northeast-2a"]
private_availability_zones      = []

# api-server instance
api_server_instance_key_name = "hush-server"

# database
hush_rds_engine = "mysql"
hush_rds_engine_version = "5.7"
hush_rds_parameter_group_family = "mysql5.7"
hush_rds_port = 3306
