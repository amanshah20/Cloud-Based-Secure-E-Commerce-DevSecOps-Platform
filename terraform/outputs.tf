output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.ec2.id
}

output "public_ip" {
  description = "Public IP of the EC2 instance."
  value       = aws_instance.ec2.public_ip
}

output "ssh_command" {
  description = "SSH command for the EC2 instance."
  value       = "ssh -i <path-to-private-key> ubuntu@${aws_instance.ec2.public_ip}"
}

output "ansible_inventory" {
  description = "Inventory line you can paste into Ansible."
  value = <<-EOT
    [kubernetes]
    luxemarket ansible_host=${aws_instance.ec2.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=<path-to-private-key>
  EOT
}

output "kubernetes_api_endpoint" {
  description = "Kubernetes API endpoint on the instance."
  value       = "https://${aws_instance.ec2.public_ip}:6443"
}
