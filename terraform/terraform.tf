provider "aws" {
  region = var.aws_region
}

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
