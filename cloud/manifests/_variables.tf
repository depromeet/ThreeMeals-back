# common
variable "project" {
  description = "The name of project name for vpc"
  type        = string
  default     = "hushit"
}

variable "aws_region" {
  description = "The region for infra"
  type        = string
}

variable "aws_profile" {
  description = "The profile for infra"
  type        = string
  default     = "default"
}

variable "name_prefix" {
  description = "Prefix for name"
  type        = string
  default     = "hushit"
}

variable "cidr_numeral" {
  description = "The VPC CIDR numeral (10.x.0.0/16)"
  type        = string
}

# vpc
variable "cidr_numeral_public" {
  description = "The public CIDR numeral (x.x.x.0/24)"
  default     = {}
}

variable "cidr_numeral_private" {
  description = "The private CIDR numeral (x.x.x.0/24)"
  default = {}
}

variable "cidr_numeral_private_db" {
  description = "The database CIDR numeral (x.x.x.0/24)"
  default = {}
}

variable "public_availability_zones" {
  description = "A comma-delimited list of availability zones for the Public subnet."
  type        = list(string)
  default     = []
}

variable "private_availability_zones" {
  description = "A comma-delimited list of availability zones for the Private subnet."
  type        = list(string)
}

variable "private_db_availability_zones" {
  description = "A comma-delimited list of availability zones for the Private db subnet."
  type        = list(string)
}

# apt_server
variable "api_server_ami" {
  description = "(Optional) The AMI of api server. (Default amazon linux2 ami)"
  type        = string
  default     = null
}

variable "api_server_instance_type" {
  description = "(Optional) The instance type of api server instance. (Default to t2.micro)"
  type        = string
  default     = "t2.micro"
}

variable "api_server_instance_key_name" {
  description = "The key pair name for api server instance."
  type        = string
}

variable "user_data_script" {
  description = "To enable use user data. If you do not use user_data script pass this variable"
  type        = string
  default     = null
}

variable "s3_hush_public_read_force_destroy" {
  description = "Whether force destroy or not s3 hush public read"
  type        = bool
  default     = false
}

# database
variable "hush_rds_engine" {
  description = "The database engine to use"
  type        = string
}

variable "hush_rds_engine_version" {
  description = "The engine version to use"
  type        = string
}

variable "hush_rds_parameter_group_family" {
  description = "The parameter group family"
  type        = string
}

variable "hush_rds_port" {
  description = "The port of rds port"
  type        = number
  default     = 3306
}
