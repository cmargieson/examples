/*
* Provider
*/

provider "aws" {
  region = var.aws_region
}

/*
* Data
*/

// Available Zones
data "aws_availability_zones" "available" {
  state = "available"
}

/*
* Outputs
*/

// Public DNS Name
output "dns_name" {
  value = aws_lb.main.dns_name
}

/*
* Virtual Private Cloud
*/

// Virtual Cloud
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = var.long_name
  }
}

// Internet Gateway
resource "aws_internet_gateway" "main" {
  tags = {
    Name = var.long_name
  }
  vpc_id = aws_vpc.main.id
}

// Route
resource "aws_route" "main" {
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
  route_table_id         = aws_vpc.main.main_route_table_id
}

// Public Subnet
resource "aws_subnet" "public" {
  availability_zone = data.aws_availability_zones.available.names[count.index]
  // cidrsubnet(iprange, newbits, netnum) 
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, var.public_subnet_count + count.index)
  count                   = var.public_subnet_count
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.long_name} (public - ${count.index})"
  }
  vpc_id = aws_vpc.main.id
}

// Public Security Group
resource "aws_security_group" "public" {
  egress { // Allow all
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }
  ingress { // Allow all tcp on 80
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    protocol    = "tcp"
    to_port     = 80
  }
  tags = {
    Name = "${var.long_name} (public)"
  }
  vpc_id = aws_vpc.main.id
}

/*
* Load Balancing
*/

// Load Balancer
resource "aws_lb" "main" {
  security_groups = [aws_security_group.public.id]
  // aws_subnet.public is tuple with 2 elements
  subnets = aws_subnet.public.*.id
  tags = {
    Name = var.long_name
  }
}

// Load Balancer Listener
resource "aws_lb_listener" "main" {
  default_action {
    target_group_arn = aws_lb_target_group.main.id
    type             = "forward"
  }
  load_balancer_arn = aws_lb.main.id
  port              = 80
  protocol          = "HTTP"
}

// Load Balancer Target Group
resource "aws_lb_target_group" "main" {
  health_check {
    matcher = "200"
    path    = "/"
  }
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id
}

/*
* Container Service
*/

// ECS Cluster
resource "aws_ecs_cluster" "application" {
  name = var.short_name
  tags = {
    Name = var.long_name
  }
}

// ECS Task Definition
resource "aws_ecs_task_definition" "application" {
  container_definitions    = file("task-definitions/${var.short_name}.json")
  cpu                      = 1024
  family                   = "${var.short_name}-ecs-task-definition"
  memory                   = 2048
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
}

// ECS Service
resource "aws_ecs_service" "application" {
  cluster       = aws_ecs_cluster.application.id
  depends_on    = [aws_lb_listener.main]
  desired_count = var.application_ecs_service_count
  launch_type   = "FARGATE"
  load_balancer {
    container_name   = var.short_name
    container_port   = 80
    target_group_arn = aws_lb_target_group.main.id
  }
  name = var.short_name
  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.public.id]
    subnets          = aws_subnet.public.*.id
  }
  task_definition = aws_ecs_task_definition.application.arn
}
