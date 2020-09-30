variable "aws_region" {
  default = "ap-southeast-2"
}

variable "long_name" {
  default = "React Template"
}

variable "short_name" {
  default = "react-template"
}

variable "availability_zones" {
  description = "Number of AWS Availability Zones within region."
  default     = 2
}

variable "cpu" {
  // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
  description = "Number of cpu units used by the task."
  default     = 256
}

variable "memory" {
  description = "Amount of (in MiB) of memory used by the task."
  default     = 512
}

variable "port" {
  description = "Port exposed by the docker image."
  default     = 2368
}

variable "docker_image" {
  description = "Docker image."
  default     = "cmargieson/react-template:latest"
}

variable "container_count" {
  description = "Number of docker containers."
  default     = 2
}








