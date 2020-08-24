# Container Mirror Image

- registry.cn-hongkong.aliyuncs.com/cmi
  - Container Mirror Image

> `gcr.io/google-containers/pause` -> `registry.cn-hongkong.aliyuncs.com/cmi/google-containers_pause`

使用场景

1. k8s - 修改 deployment 镜像
2. helm - 修改 values 里的 repository
3. docker - 直接指定

## 为什么选择 cn-hongkong

- 外网推送到 cn-hongkong 比推送到 cn-shanghai 更快
- 内网拉取 cn-hongkong 和 cn-shanghai 速度区别不大

## Images

| container                                             | version | mirror                                      | mirrored at         |
| ----------------------------------------------------- | ------- | ------------------------------------------- | ------------------- |
| k8s.gcr.io/defaultbackend-amd64                       | 1.5     | google-containers_defaultbackend-amd64      | 2020-08-23 12:42:16 |
| gcr.io/cadvisor/cadvisor                              | v0.36.0 | cadvisor_cadvisor                           | -                   |
| us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller | v0.34.1 | k8s-artifacts-prod_ingress-nginx_controller | -                   |
| gcr.io/google_containers/defaultbackend               | 1.0     | google_containers_defaultbackend            | -                   |
| quay.io/jetstack/cert-manager-controller              | v0.16.1 | jetstack_cert-manager-controller            | -                   |
| quay.io/jetstack/cert-manager-webhook                 | v0.16.1 | jetstack_cert-manager-webhook               | -                   |
| quay.io/jetstack/cert-manager-cainjector              | v0.16.1 | jetstack_cert-manager-cainjector            | -                   |
| docker.io/jettech/kube-webhook-certgen                | v1.2.2  | jettech_kube-webhook-certgen                | -                   || gcr.io/google-containers/pause | 3.0 | registry.cn-hongkong.aliyuncs.com/cmi/google-containers_pause:3.0 | 2020-08-24 06:15:31 |
| gcr.io/google-containers/pause | 3.1 | registry.cn-hongkong.aliyuncs.com/cmi/google-containers_pause:3.1 | 2020-08-24 06:15:49 |
| gcr.io/google-containers/pause | 3.2 | registry.cn-hongkong.aliyuncs.com/cmi/google-containers_pause:3.2 | 2020-08-24 06:16:08 |

