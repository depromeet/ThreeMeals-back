# vpc (cidr: /16)
resource "aws_vpc" "default" {
  cidr_block           = "10.${var.cidr_numeral}.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name    = "${var.name_prefix}-vpc-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Internet gateway
resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name    = "${var.name_prefix}-internet-gateway-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Public subnet (cidr: /24)
resource "aws_subnet" "public" {
  count = length(var.public_availability_zones)

  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.${var.cidr_numeral}.${var.cidr_numeral_public[count.index]}.0/24"
  availability_zone = element(var.public_availability_zones, count.index)

  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.name_prefix}-public-subnet-${count.index}-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Route Table for public subnets
resource "aws_route_table" "public" {
  count  = length(var.public_availability_zones)
  vpc_id = aws_vpc.default.id

  tags = {
    Name    = "${var.name_prefix}-public-rt-${count.index}-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Route Table Association for public subnets
resource "aws_route_table_association" "public" {
  count          = length(var.public_availability_zones)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = element(aws_route_table.public.*.id, count.index)
}

# Route for internet gateway
resource "aws_route" "public_internet_gateway" {
  count                  = length(var.public_availability_zones)
  route_table_id         = element(aws_route_table.public.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.default.id
}

# Private subnet
resource "aws_subnet" "private" {
  count = length(var.private_availability_zones)

  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.${var.cidr_numeral}.${var.cidr_numeral_private[count.index]}.0/24"
  availability_zone = element(var.private_availability_zones, count.index)

  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.name_prefix}-private-subnet-${count.index}-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

resource "aws_route_table" "private" {
  count  = length(var.private_availability_zones)
  vpc_id = aws_vpc.default.id

  tags = {
    Name    = "${var.name_prefix}-private-route-table-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Route Table Association for private subnets
resource "aws_route_table_association" "private" {
  count          = length(var.private_availability_zones)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}

resource "aws_subnet" "private_db" {
  count = length(var.private_db_availability_zones)

  vpc_id            = aws_vpc.default.id
  cidr_block        = "10.${var.cidr_numeral}.${var.cidr_numeral_private_db[count.index]}.0/24"
  availability_zone = element(var.private_db_availability_zones, count.index)

  map_public_ip_on_launch = false

  tags = {
    Name    = "${var.name_prefix}-private_db-subnet-${count.index}-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Route Table for db Private subnet
resource "aws_route_table" "private_db" {
  count  = length(var.private_db_availability_zones)
  vpc_id = aws_vpc.default.id

  tags = {
    Name    = "${var.name_prefix}-private_db-route-table-${random_id.name_suffix.hex}"
    Project = var.project
  }
}

# Route Table Association for db private subnets
resource "aws_route_table_association" "private_db" {
  count          = length(var.private_db_availability_zones)
  subnet_id      = element(aws_subnet.private_db.*.id, count.index)
  route_table_id = element(aws_route_table.private_db.*.id, count.index)
}
