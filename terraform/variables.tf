variable "aws_region" {
  description = "AWS region to launch the EC2 instance in."
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type for the Kubernetes node."
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "Name of the AWS key pair to create."
  type        = string
  default     = "luxemarket-k8s"
}

variable "public_key_path" {
  description = "Path to the SSH public key that Terraform will upload to AWS."
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR range allowed to SSH into the EC2 instance."
  type        = string
}

variable "allowed_kubernetes_api_cidr" {
  description = "CIDR range allowed to reach the Kubernetes API server."
  type        = string
}

variable "allowed_nodeport_cidr" {
  description = "CIDR range allowed to reach the Kubernetes NodePort service."
  type        = string
  default     = "0.0.0.0/0"
}
