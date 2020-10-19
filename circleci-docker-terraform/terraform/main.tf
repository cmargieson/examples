terraform {
  required_version = ">= 0.12"
}

/*
* Provider
*/

provider "aws" {
  region = var.aws_region
}

/*
* Data
*/

// AWS Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

/*
* Outputs
*/

// Public DNS Name
output "dns_name" {
  // The DNS name of the load balancer
  value = aws_lb.main.dns_name
}

/*
* Virtual Private Cloud
*/

// AWS Virtual Private Cloud
resource "aws_vpc" "main" {
  // A range of IPv4 addresses for the VPC
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = var.long_name
  }
}

/*
* Network
*/

// AWS Private Subnet
resource "aws_subnet" "private" {
  availability_zone = data.aws_availability_zones.available.names[count.index]
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  count             = var.availability_zones
  vpc_id            = aws_vpc.main.id

  tags = {
    Name = "${var.long_name} (private - ${count.index})"
  }
}

// AWS Public Subnet
resource "aws_subnet" "public" {
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, var.availability_zones + count.index)
  count                   = var.availability_zones
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.main.id

  tags = {
    Name = "${var.long_name} (public - ${count.index})"
  }
}

// AWS Internet Gateway
resource "aws_internet_gateway" "gw" {
  // Allow communication between VPC and internet
  vpc_id = aws_vpc.main.id

  tags = {
    Name = var.long_name
  }
}

// AWS Route
resource "aws_route" "r" {
  // Direct internet-bound traffic to the internet gateway 
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
  route_table_id         = aws_vpc.main.main_route_table_id
}

// AWS Elastic IP
resource "aws_eip" "eip" {
  // Ensure that instances in subnet have unique IP
  count      = var.availability_zones
  depends_on = [aws_internet_gateway.gw]
  vpc        = true

}

// AWS Nat Gateway
resource "aws_nat_gateway" "ng" {
  allocation_id = element(aws_eip.eip.*.id, count.index)
  count         = var.availability_zones
  subnet_id     = element(aws_subnet.public.*.id, count.index)
}

// AWS Route Table
resource "aws_route_table" "rt" {
  count = var.availability_zones
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = element(aws_nat_gateway.ng.*.id, count.index)
  }
  vpc_id = aws_vpc.main.id
}

// AWS Route Table Association
resource "aws_route_table_association" "rta" {
  count          = var.availability_zones
  route_table_id = element(aws_route_table.rt.*.id, count.index)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
}

/*
* Security
*/

// AWS Security Group
resource "aws_security_group" "lb" {
  description = "Controls access to the load balancer."
  name        = "${var.short_name}-lb"
  vpc_id      = aws_vpc.main.id
  ingress { // Allow all tcp on 80
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress { // Allow all
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// AWS Security Group
resource "aws_security_group" "instance" {
  description = "Controls access to docker instances."
  name        = "${var.short_name}-instance"
  vpc_id      = aws_vpc.main.id
  ingress { // Allow TCP from load balancer
    protocol  = "tcp"
    from_port = var.port
    to_port   = var.port
    security_groups = [
      aws_security_group.lb.id,
    ]
  }
  egress { // Allow all
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

/*
* Load Balancing
*/

// AWS Load Balancer
resource "aws_lb" "main" {
  security_groups = [aws_security_group.lb.id]
  subnets         = aws_subnet.public.*.id

  tags = {
    Name = var.long_name
  }
}

// AWS Load Balancer Target Group
resource "aws_lb_target_group" "app" {
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = var.long_name
  }
}

// AWS Load Balancer Listener
resource "aws_lb_listener" "front_end" {
  default_action {
    target_group_arn = aws_lb_target_group.app.id
    type             = "forward"
  }
  load_balancer_arn = aws_lb.main.id
  port              = 80
  protocol          = "HTTP"
}

/*
* Container Service
*/

// AWS Elastic Container Service Cluster
resource "aws_ecs_cluster" "application" {
  name = var.short_name
}

// AWS ECS Elastic Container Service Task Definition
resource "aws_ecs_task_definition" "application" {
  container_definitions    = <<DEFINITION
[
  {
    "cpu": ${var.cpu},
    "image": "${var.docker_image}",
    "memory": ${var.memory},
    "name": "${var.short_name}",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": ${var.port},
        "hostPort": ${var.port}
      }
    ]
  }
]
DEFINITION
  cpu                      = var.cpu
  family                   = var.short_name
  memory                   = var.memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
}

// ECS Service
resource "aws_ecs_service" "application" {
  cluster       = aws_ecs_cluster.application.id
  depends_on    = [aws_lb_listener.front_end]
  desired_count = var.container_count
  launch_type   = "FARGATE"
  load_balancer {
    container_name   = var.short_name
    container_port   = var.port
    target_group_arn = aws_lb_target_group.app.id
  }
  name = var.short_name
  network_configuration {

    security_groups = [aws_security_group.instance.id]
    subnets         = aws_subnet.private.*.id
  }
  task_definition = aws_ecs_task_definition.application.arn
}


