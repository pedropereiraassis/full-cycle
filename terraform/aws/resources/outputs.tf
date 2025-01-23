locals {
  kubeconfig = <<KUBECONFIG
  apiVersion: v1
  clusters:
  - cluster:
      server: ${aws_eks_cluster.new-cluster.endpoint}
      certificate-authority-data: ${aws_eks_cluster.new-cluster.certificate_authority[0].data}
    name: kubernetes
  contexts:
  - context:
      cluster: kubernetes
      user: "${aws_eks_cluster.new-cluster.name}"
    name: "${aws_eks_cluster.new-cluster.name}"
  current-context: "${aws_eks_cluster.new-cluster.name}"
  kind: Config
  preferences: {}
  users:
  - name: "${aws_eks_cluster.new-cluster.name}"
    user:
      exec:
        apiVersion: client.authentication.k8s.io/v1alpha1
        command: aws-iam-authenticator
        args:
          - "token"
          - "-i"
          - "${aws_eks_cluster.new-cluster.name}"
  KUBECONFIG
}

resource "local_file" "kubeconfig" {
  filename = "kubeconfig"
  content = local.kubeconfig
}