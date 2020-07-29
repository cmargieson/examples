provider "aws" {
  region = var.aws_region
}

// Access load balancer from 80
resource "aws_security_group" "react-template-lb-security-group" {
  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }
  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    protocol    = "tcp"
    to_port     = 80
  }
  name = "react-template-lb-security-group"
}

// Access cluster from load balancer only
resource "aws_security_group" "react-template-cluster-security-group" {
  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }
  ingress {
    from_port       = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.react-template-lb-security-group.id]
    to_port         = 80
  }
  name = "react-template-cluster-security-group"
}

