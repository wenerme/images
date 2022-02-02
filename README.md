# Container Mirror Image

主动容器镜像同步阿里云。可配合 Helm 和 Kustomize 使用。配置可参见 [wenerme/kube-stub-cluster](https://github.com/wenerme/kube-stub-cluster)

- registry.cn-hongkong.aliyuncs.com/cmi
  - Container Mirror Image

> `gcr.io/google-containers/pause` -> `registry.cn-hongkong.aliyuncs.com/cmi/google-containers_pause`

## 动机

1. 部署失败

当 helm 部署 ingress-nginx 发现卡在拉镜像 - 发现永远无法成功，因为镜像在 k8s.gcr.io

> Back-off pulling image

2. 更新奇慢

例如：当更新 sealed-secret，发现用了半个小时，因为镜像在 quay.io。
然后修改镜像为国内 quay.io 镜像, 发现依然奇慢无比 - 多半是因为被动拉镜像。

即便是在 docker.io 上的镜像添加了国内镜像也会慢，例如 argoproj/argocli 差不多 40M 用了 28 分钟。

> Faster is always better.

3. 测试奇慢

例如：本地使用 keycloak 测试登陆，镜像过大，即便通过镜像后的 docker.io 拉取也很慢。

4. 镜像拉取阻塞

因为相同镜像(digest 相同)拉取会被阻塞，如果先发现失败再修改镜像也需要等待之前拉取失败才能从新拉取。提前准备好会更省事。

5. 同步镜像快

如果发现有需要的镜像，修改 sync.sh 等待同步完成也就 3-5 分钟，比等待镜像拉取失败和重试快得多。

## 使用方式

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
| docker.io/jettech/kube-webhook-certgen                | v1.2.2  | jettech_kube-webhook-certgen                | -                   |
| gcr.io/google-containers/pause | 3.0 | google-containers_pause:3.0 | 2020-08-24 06:15:31 |
| gcr.io/google-containers/pause | 3.1 | google-containers_pause:3.1 | 2020-08-24 06:15:49 |
| gcr.io/google-containers/pause | 3.2 | google-containers_pause:3.2 | 2020-08-24 06:16:08 |
| quay.io/thanos/thanos | v0.14.0 | thanos_thanos | 2020-08-25 10:03:32 |
| k8s.gcr.io/ingress-nginx/controller | v0.35.0 | ingress-nginx_controller | 2020-09-01 17:41:57 |
| quay.io/jetstack/cert-manager-controller | v1.0.0 | jetstack_cert-manager-controller | 2020-09-02 12:18:58 |
| quay.io/jetstack/cert-manager-webhook | v1.0.0 | jetstack_cert-manager-webhook | 2020-09-02 12:19:23 |
| quay.io/jetstack/cert-manager-cainjector | v1.0.0 | jetstack_cert-manager-cainjector | 2020-09-02 12:19:46 |
| gcr.io/linkerd-io/proxy | stable-2.8.1 | linkerd-io_proxy | 2020-09-04 22:43:09 |
| gcr.io/linkerd-io/controller | stable-2.8.1 | linkerd-io_controller | 2020-09-04 22:43:11 |
| gcr.io/linkerd-io/debug | stable-2.8.1 | linkerd-io_debug | 2020-09-04 22:43:21 |
| gcr.io/linkerd-io/web | stable-2.8.1 | linkerd-io_web | 2020-09-04 22:43:25 |
| gcr.io/linkerd-io/grafana | stable-2.8.1 | linkerd-io_grafana | 2020-09-04 22:43:30 |
| gcr.io/linkerd-io/proxy-init | v1.3.3 | linkerd-io_proxy-init | 2020-09-04 22:44:35 |
| quay.io/jetstack/cert-manager-controller | v1.0.1 | jetstack_cert-manager-controller | 2020-09-04 20:16:17 |
| quay.io/jetstack/cert-manager-webhook | v1.0.1 | jetstack_cert-manager-webhook | 2020-09-04 20:16:38 |
| quay.io/jetstack/cert-manager-cainjector | v1.0.1 | jetstack_cert-manager-cainjector | 2020-09-04 20:16:59 |
| gcr.io/linkerd-io/cni-plugin | stable-2.8.1 | linkerd-io_cni-plugin | 2020-09-05 18:10:13 |
| quay.io/thanos/thanos | v0.15.0 | thanos_thanos | 2020-09-07 10:15:43 |
| quay.io/jetstack/cert-manager-controller | v1.0.2 | jetstack_cert-manager-controller | 2020-09-22 16:16:48 |
| quay.io/jetstack/cert-manager-webhook | v1.0.2 | jetstack_cert-manager-webhook | 2020-09-22 16:17:07 |
| quay.io/jetstack/cert-manager-cainjector | v1.0.2 | jetstack_cert-manager-cainjector | 2020-09-22 16:17:26 |
| quay.io/jetstack/cert-manager-acmesolver | v1.0.2 | jetstack_cert-manager-acmesolver | 2020-09-22 16:17:45 |
| quay.io/jetstack/cert-manager-controller | v1.0.3 | jetstack_cert-manager-controller | 2020-10-08 10:17:51 |
| quay.io/jetstack/cert-manager-webhook | v1.0.3 | jetstack_cert-manager-webhook | 2020-10-08 10:18:12 |
| quay.io/jetstack/cert-manager-cainjector | v1.0.3 | jetstack_cert-manager-cainjector | 2020-10-08 10:18:34 |
| quay.io/jetstack/cert-manager-acmesolver | v1.0.3 | jetstack_cert-manager-acmesolver | 2020-10-08 10:18:54 |
| quay.io/thanos/thanos | v0.15.0 | thanos_thanos | 2020-10-09 12:31:50 |
| quay.io/thanos/thanos | v0.16.0 | thanos_thanos | 2020-10-26 16:28:19 |
| quay.io/jetstack/cert-manager-controller | v1.0.4 | jetstack_cert-manager-controller | 2020-10-29 16:28:25 |
| quay.io/jetstack/cert-manager-webhook | v1.0.4 | jetstack_cert-manager-webhook | 2020-10-29 16:28:43 |
| quay.io/jetstack/cert-manager-cainjector | v1.0.4 | jetstack_cert-manager-cainjector | 2020-10-29 16:29:02 |
| quay.io/jetstack/cert-manager-acmesolver | v1.0.4 | jetstack_cert-manager-acmesolver | 2020-10-29 16:29:20 |
| gcr.io/cadvisor/cadvisor | v0.37.0 | cadvisor_cadvisor | 2020-11-10 08:13:08 |
| k8s.gcr.io/ingress-nginx/controller | v0.41.2 | ingress-nginx_controller | 2020-11-17 07:25:51 |
| docker.io/jettech/kube-webhook-certgen | v1.5.0 | jettech_kube-webhook-certgen | 2020-11-17 07:26:30 |
| quay.io/thanos/thanos | v0.17.0 | thanos_thanos | 2020-11-20 13:11:38 |
| quay.io/jetstack/cert-manager-controller | v1.1.0 | jetstack_cert-manager-controller | 2020-11-24 18:14:47 |
| quay.io/jetstack/cert-manager-webhook | v1.1.0 | jetstack_cert-manager-webhook | 2020-11-24 18:15:08 |
| quay.io/jetstack/cert-manager-cainjector | v1.1.0 | jetstack_cert-manager-cainjector | 2020-11-24 18:15:28 |
| quay.io/jetstack/cert-manager-acmesolver | v1.1.0 | jetstack_cert-manager-acmesolver | 2020-11-24 18:15:48 |
| quay.io/keycloak/keycloak | 11.0.3 | keycloak_keycloak | 2020-11-25 12:00:19 |
| quay.io/thanos/thanos | v0.17.1 | thanos_thanos | 2020-11-26 12:19:47 |
| quay.io/thanos/thanos | v0.17.2 | thanos_thanos | 2020-12-08 10:23:42 |
| quay.io/jetstack/cert-manager-webhook | v1.1.0 | jetstack_cert-manager-webhook | 2020-12-13 16:26:42 |
| gcr.io/kaniko-project/executor | v1.3.0 | kaniko-project_executor | 2020-12-16 15:54:23 |
| gcr.io/kaniko-project/executor | v1.3.0-debug | kaniko-project_executor | 2020-12-16 15:54:53 |
| gcr.io/kaniko-project/executor | debug | kaniko-project_executor | 2020-12-16 15:55:04 |
| quay.io/keycloak/keycloak | 12.0.1 | keycloak_keycloak | 2021-01-15 14:16:40 |
| k8s.gcr.io/ingress-nginx/controller | v0.43.0 | ingress-nginx_controller | 2021-01-20 15:11:45 |
| quay.io/thanos/thanos | v0.18.0 | thanos_thanos | 2021-02-01 20:24:47 |
| quay.io/jetstack/cert-manager-controller | v1.2.0 | jetstack_cert-manager-controller | 2021-02-11 12:24:42 |
| quay.io/jetstack/cert-manager-webhook | v1.2.0 | jetstack_cert-manager-webhook | 2021-02-11 12:25:04 |
| quay.io/jetstack/cert-manager-cainjector | v1.2.0 | jetstack_cert-manager-cainjector | 2021-02-11 12:25:27 |
| quay.io/jetstack/cert-manager-acmesolver | v1.2.0 | jetstack_cert-manager-acmesolver | 2021-02-11 12:25:49 |
| quay.io/jetstack/cert-manager-controller | v1.1.1 | jetstack_cert-manager-controller | 2021-02-16 18:19:51 |
| quay.io/jetstack/cert-manager-webhook | v1.1.1 | jetstack_cert-manager-webhook | 2021-02-16 18:20:15 |
| quay.io/jetstack/cert-manager-cainjector | v1.1.1 | jetstack_cert-manager-cainjector | 2021-02-16 18:20:37 |
| quay.io/jetstack/cert-manager-acmesolver | v1.1.1 | jetstack_cert-manager-acmesolver | 2021-02-16 18:20:59 |
| gcr.io/cadvisor/cadvisor | v0.37.5 | cadvisor_cadvisor | 2021-02-18 08:20:16 |
| argoproj/argocd | v1.7.12 | argocd | 2021-02-19 15:35:25 |
| argoproj/argocd | v1.8.4 | argocd | 2021-02-19 15:54:54 |
| argoproj/argocd | v1.8.5 | argocd | 2021-02-20 06:20:22 |
| k8s.gcr.io/ingress-nginx/controller | v0.44.0 | ingress-nginx_controller | 2021-02-21 12:46:42 |
| docker.io/jettech/kube-webhook-certgen | v1.5.1 | jettech_kube-webhook-certgen | 2021-02-21 13:48:30 |
| gcr.io/kaniko-project/executor | v1.5.0 | kaniko-project_executor | 2021-02-23 06:33:07 |
| gcr.io/kaniko-project/executor | v1.5.0-debug | kaniko-project_executor | 2021-02-23 06:34:00 |
| gcr.io/kaniko-project/executor | v1.5.1 | kaniko-project_executor | 2021-02-23 10:19:10 |
| gcr.io/kaniko-project/executor | v1.5.1-debug | kaniko-project_executor | 2021-02-23 10:19:46 |
| quay.io/keycloak/keycloak | 12.0.3 | keycloak_keycloak | 2021-02-23 13:23:09 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.0.1 | oauth2-proxy_oauth2-proxy | 2021-02-24 09:18:11 |
| ghcr.io/dexidp/dex | v2.27.0 | dexidp_dex | 2021-02-24 15:09:46 |
| argoproj/argocd | v1.7.13 | argocd | 2021-02-26 18:20:43 |
| argoproj/argocd | v1.8.6 | argocd | 2021-02-26 22:20:47 |
| quay.io/keycloak/keycloak | 12.0.4 | keycloak_keycloak | 2021-03-01 10:50:39 |
| argoproj/argocd | v1.8.7 | argocd | 2021-03-03 06:21:20 |
| quay.io/bitnami/sealed-secrets-controller | v0.15.0 | bitnami_sealed-secrets-controller | 2021-03-03 13:17:37 |
| argoproj/argocd | v1.7.14 | argocd | 2021-03-03 20:20:20 |
| docker.io/argoproj/argocd | v1.7.14 | argoproj_argocd | 2021-03-04 14:20:15 |
| docker.io/argoproj/argoexec | v2.12.9 | argoproj_argoexec | 2021-03-04 15:22:14 |
| registry.opensource.zalan.do/acid/postgres-operator | v1.6.1 | acid_postgres-operator | 2021-03-05 14:41:52 |
| registry.opensource.zalan.do/acid/spilo-13 | 2.0-p5 | acid_spilo-13 | 2021-03-06 08:52:51 |
| registry.opensource.zalan.do/acid/spilo-13 | 2.0-p4 | acid_spilo-13 | 2021-03-06 08:54:04 |
| registry.opensource.zalan.do/acid/logical-backup | v1.6.1 | acid_logical-backup | 2021-03-06 09:04:06 |
| registry.opensource.zalan.do/acid/pgbouncer | master-14 | acid_pgbouncer | 2021-03-06 09:04:39 |
| registry.opensource.zalan.do/acid/postgres-operator-ui | v1.6.1 | acid_postgres-operator-ui | 2021-03-06 09:53:05 |
| docker.io/argoproj/argocli | v2.12.10 | argoproj_argocli | 2021-03-09 00:44:38 |
| docker.io/argoproj/workflow-controller | v2.12.10 | argoproj_workflow-controller | 2021-03-09 00:45:02 |
| docker.io/argoproj/argoexec | v2.12.10 | argoproj_argoexec | 2021-03-09 00:45:42 |
| ghcr.io/dexidp/dex | v2.28.0 | dexidp_dex | 2021-03-13 00:44:44 |
| ghcr.io/dexidp/dex | v2.28.1 | dexidp_dex | 2021-03-20 20:20:22 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.1.0 | oauth2-proxy_oauth2-proxy | 2021-03-25 18:35:30 |
| quay.io/jetstack/cert-manager-controller | v1.3.0-alpha.0 | jetstack_cert-manager-controller | 2021-03-26 14:22:34 |
| quay.io/jetstack/cert-manager-webhook | v1.3.0-alpha.0 | jetstack_cert-manager-webhook | 2021-03-26 14:22:56 |
| quay.io/jetstack/cert-manager-cainjector | v1.3.0-alpha.0 | jetstack_cert-manager-cainjector | 2021-03-26 14:23:19 |
| quay.io/jetstack/cert-manager-acmesolver | v1.3.0-alpha.0 | jetstack_cert-manager-acmesolver | 2021-03-26 14:23:40 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.1.1 | oauth2-proxy_oauth2-proxy | 2021-03-29 18:28:23 |
| registry.opensource.zalan.do/acid/spilo-13 | 2.0-p6 | acid_spilo-13 | 2021-03-30 16:39:40 |
| docker.io/argoproj/argocli | v3.0.0 | argoproj_argocli | 2021-03-30 22:24:23 |
| docker.io/argoproj/workflow-controller | v3.0.0 | argoproj_workflow-controller | 2021-03-30 22:24:46 |
| docker.io/argoproj/argoexec | v3.0.0 | argoproj_argoexec | 2021-03-30 22:25:27 |
| gcr.io/kaniko-project/executor | v1.5.2 | kaniko-project_executor | 2021-03-31 00:55:46 |
| gcr.io/kaniko-project/executor | v1.5.2-debug | kaniko-project_executor | 2021-03-31 00:56:18 |
| quay.io/thanos/thanos | v0.19.0 | thanos_thanos | 2021-03-31 16:39:15 |
| registry.opensource.zalan.do/acid/postgres-operator | v1.6.2 | acid_postgres-operator | 2021-04-01 12:31:10 |
| registry.opensource.zalan.do/acid/logical-backup | v1.6.2 | acid_logical-backup | 2021-04-01 12:31:57 |
| registry.opensource.zalan.do/acid/postgres-operator-ui | v1.6.2 | acid_postgres-operator-ui | 2021-04-01 12:33:02 |
| docker.io/argoproj/argocli | v3.0.1 | argoproj_argocli | 2021-04-01 20:24:14 |
| docker.io/argoproj/workflow-controller | v3.0.1 | argoproj_workflow-controller | 2021-04-01 20:24:40 |
| docker.io/argoproj/argoexec | v3.0.1 | argoproj_argoexec | 2021-04-01 20:25:22 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.1.2 | oauth2-proxy_oauth2-proxy | 2021-04-02 12:30:29 |
| docker.io/argoproj/argocli | v2.12.11 | argoproj_argocli | 2021-04-06 18:38:40 |
| docker.io/argoproj/workflow-controller | v2.12.11 | argoproj_workflow-controller | 2021-04-06 18:39:02 |
| docker.io/argoproj/argoexec | v2.12.11 | argoproj_argoexec | 2021-04-06 18:39:38 |
| docker.io/argoproj/argocd | v2.0.0 | argoproj_argocd | 2021-04-07 06:28:25 |
| quay.io/jetstack/cert-manager-controller | v1.3.0 | jetstack_cert-manager-controller | 2021-04-08 12:31:58 |
| quay.io/jetstack/cert-manager-webhook | v1.3.0 | jetstack_cert-manager-webhook | 2021-04-08 12:32:19 |
| quay.io/jetstack/cert-manager-cainjector | v1.3.0 | jetstack_cert-manager-cainjector | 2021-04-08 12:32:40 |
| quay.io/jetstack/cert-manager-acmesolver | v1.3.0 | jetstack_cert-manager-acmesolver | 2021-04-08 12:33:00 |
| quay.io/jetstack/cert-manager-controller | v1.3.1 | jetstack_cert-manager-controller | 2021-04-14 12:30:24 |
| quay.io/jetstack/cert-manager-webhook | v1.3.1 | jetstack_cert-manager-webhook | 2021-04-14 12:30:44 |
| quay.io/jetstack/cert-manager-cainjector | v1.3.1 | jetstack_cert-manager-cainjector | 2021-04-14 12:31:03 |
| quay.io/jetstack/cert-manager-acmesolver | v1.3.1 | jetstack_cert-manager-acmesolver | 2021-04-14 12:31:22 |
| docker.io/argoproj/argocd | v2.0.1 | argoproj_argocd | 2021-04-16 01:02:15 |
| docker.io/argoproj/argocli | v3.0.2 | argoproj_argocli | 2021-04-20 16:38:25 |
| docker.io/argoproj/workflow-controller | v3.0.2 | argoproj_workflow-controller | 2021-04-20 16:38:47 |
| docker.io/argoproj/argoexec | v3.0.2 | argoproj_argoexec | 2021-04-20 16:39:26 |
| registry.opensource.zalan.do/acid/pgbouncer | master-16 | acid_pgbouncer | 2021-04-21 13:59:05 |
| gcr.io/kaniko-project/executor | v1.6.0 | kaniko-project_executor | 2021-04-26 20:21:45 |
| gcr.io/kaniko-project/executor | v1.6.0-debug | kaniko-project_executor | 2021-04-26 20:22:19 |
| quay.io/thanos/thanos | v0.20.0 | thanos_thanos | 2021-04-28 14:22:56 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.1.3 | oauth2-proxy_oauth2-proxy | 2021-04-28 18:34:55 |
| quay.io/thanos/thanos | v0.20.1 | thanos_thanos | 2021-04-30 14:21:17 |
| quay.io/keycloak/keycloak | 13.0.0 | keycloak_keycloak | 2021-05-06 14:21:38 |
| quay.io/bitnami/sealed-secrets-controller | v0.16.0 | bitnami_sealed-secrets-controller | 2021-05-10 22:24:00 |
| docker.io/argoproj/argocli | v3.0.3 | argoproj_argocli | 2021-05-12 00:56:54 |
| docker.io/argoproj/workflow-controller | v3.0.3 | argoproj_workflow-controller | 2021-05-12 00:57:17 |
| docker.io/argoproj/argoexec | v3.0.3 | argoproj_argoexec | 2021-05-12 00:57:59 |
| docker.io/argoproj/argocli | v3.0.4 | argoproj_argocli | 2021-05-14 08:25:55 |
| docker.io/argoproj/workflow-controller | v3.0.4 | argoproj_workflow-controller | 2021-05-14 08:26:15 |
| docker.io/argoproj/argoexec | v3.0.4 | argoproj_argoexec | 2021-05-14 08:26:53 |
| docker.io/argoproj/argocd | v2.0.2 | argoproj_argocd | 2021-05-20 20:22:14 |
| quay.io/thanos/thanos | v0.20.2 | thanos_thanos | 2021-05-21 10:23:38 |
| k8s.gcr.io/ingress-nginx/controller | v0.46.0 | ingress-nginx_controller | 2021-05-23 10:32:00 |
| docker.io/argoproj/argocli | v3.0.5 | argoproj_argocli | 2021-05-24 20:23:31 |
| docker.io/argoproj/workflow-controller | v3.0.5 | argoproj_workflow-controller | 2021-05-24 20:23:55 |
| docker.io/argoproj/argoexec | v3.0.5 | argoproj_argoexec | 2021-05-24 20:24:38 |
| docker.io/argoproj/argocli | v3.0.6 | argoproj_argocli | 2021-05-25 01:05:14 |
| docker.io/argoproj/workflow-controller | v3.0.6 | argoproj_workflow-controller | 2021-05-25 01:05:38 |
| docker.io/argoproj/argoexec | v3.0.6 | argoproj_argoexec | 2021-05-25 01:06:20 |
| quay.io/keycloak/keycloak | 13.0.1 | keycloak_keycloak | 2021-05-25 10:30:12 |
| docker.io/argoproj/argocli | v3.0.7 | argoproj_argocli | 2021-05-25 20:24:47 |
| docker.io/argoproj/workflow-controller | v3.0.7 | argoproj_workflow-controller | 2021-05-25 20:25:13 |
| docker.io/argoproj/argoexec | v3.0.7 | argoproj_argoexec | 2021-05-25 20:25:57 |
| registry.opensource.zalan.do/acid/spilo-13 | 2.0-p7 | acid_spilo-13 | 2021-05-26 08:37:17 |
| docker.io/argoproj/argocd | v2.0.3 | argoproj_argocd | 2021-05-27 20:33:15 |
| registry.opensource.zalan.do/acid/logical-backup | v1.6.3 | acid_logical-backup | 2021-05-28 14:37:08 |
| registry.opensource.zalan.do/acid/postgres-operator-ui | v1.6.3 | acid_postgres-operator-ui | 2021-05-28 14:38:15 |
| quay.io/thanos/thanos | v0.21.0 | thanos_thanos | 2021-06-03 14:40:04 |
| quay.io/thanos/thanos | v0.21.1 | thanos_thanos | 2021-06-04 13:04:58 |
| quay.io/jetstack/cert-manager-controller | v1.4.0 | jetstack_cert-manager-controller | 2021-06-15 14:16:37 |
| quay.io/jetstack/cert-manager-webhook | v1.4.0 | jetstack_cert-manager-webhook | 2021-06-15 14:16:56 |
| quay.io/jetstack/cert-manager-cainjector | v1.4.0 | jetstack_cert-manager-cainjector | 2021-06-15 14:17:14 |
| quay.io/jetstack/cert-manager-acmesolver | v1.4.0 | jetstack_cert-manager-acmesolver | 2021-06-15 14:17:32 |
| quay.io/keycloak/keycloak | 14.0.0 | keycloak_keycloak | 2021-06-18 10:19:52 |
| docker.io/argoproj/argocli | v3.0.8 | argoproj_argocli | 2021-06-23 16:22:33 |
| docker.io/argoproj/workflow-controller | v3.0.8 | argoproj_workflow-controller | 2021-06-23 16:22:54 |
| docker.io/argoproj/argoexec | v3.0.8 | argoproj_argoexec | 2021-06-23 16:23:29 |
| docker.io/argoproj/argocd | v2.0.4 | argoproj_argocd | 2021-06-23 16:24:46 |
| docker.io/argoproj/argocli | v3.1.1 | argoproj_argocli | 2021-06-28 22:17:35 |
| docker.io/argoproj/workflow-controller | v3.1.1 | argoproj_workflow-controller | 2021-06-28 22:17:57 |
| docker.io/argoproj/argoexec | v3.1.1 | argoproj_argoexec | 2021-06-28 22:18:37 |
| ghcr.io/dexidp/dex | v2.29.0 | dexidp_dex | 2021-06-29 16:27:24 |
| quay.io/argocdapplicationset/argocd-applicationset | v0.1.0 | argocdapplicationset_argocd-applicationset | 2021-07-02 14:11:05 |
| docker.io/argoproj/argocli | v3.1.3 | argoproj_argocli | 2021-08-01 10:42:15 |
| docker.io/argoproj/workflow-controller | v3.1.3 | argoproj_workflow-controller | 2021-08-01 10:42:36 |
| docker.io/argoproj/argoexec | v3.1.3 | argoproj_argoexec | 2021-08-01 10:43:14 |
| docker.io/argoproj/argocd | v2.0.5 | argoproj_argocd | 2021-08-01 10:44:27 |
| quay.io/jetstack/cert-manager-controller | v1.4.1 | jetstack_cert-manager-controller | 2021-08-01 10:44:58 |
| quay.io/jetstack/cert-manager-webhook | v1.4.1 | jetstack_cert-manager-webhook | 2021-08-01 10:45:17 |
| quay.io/jetstack/cert-manager-cainjector | v1.4.1 | jetstack_cert-manager-cainjector | 2021-08-01 10:45:36 |
| quay.io/jetstack/cert-manager-acmesolver | v1.4.1 | jetstack_cert-manager-acmesolver | 2021-08-01 10:45:53 |
| quay.io/thanos/thanos | v0.22.0 | thanos_thanos | 2021-08-01 10:46:13 |
| k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner | v4.0.2 | sig-storage_nfs-subdir-external-provisioner | 2021-08-01 17:49:53 |
| k8s.gcr.io/ingress-nginx/controller | v0.47.0 | ingress-nginx_controller | 2021-08-01 21:33:08 |
| quay.io/jetstack/cert-manager-controller | v1.3.2 | jetstack_cert-manager-controller | 2021-08-02 14:16:29 |
| quay.io/jetstack/cert-manager-webhook | v1.3.2 | jetstack_cert-manager-webhook | 2021-08-02 14:16:48 |
| quay.io/jetstack/cert-manager-cainjector | v1.3.2 | jetstack_cert-manager-cainjector | 2021-08-02 14:17:07 |
| quay.io/jetstack/cert-manager-acmesolver | v1.3.2 | jetstack_cert-manager-acmesolver | 2021-08-02 14:17:25 |
| ghcr.io/dexidp/dex | v2.30.0 | dexidp_dex | 2021-08-03 14:16:26 |
| k8s.gcr.io/ingress-nginx/controller | v0.48.1 | ingress-nginx_controller | 2021-08-03 16:32:49 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.0-beta.1 | ingress-nginx_controller | 2021-08-03 18:22:37 |
| docker.io/argoproj/argocli | v3.1.4 | argoproj_argocli | 2021-08-04 02:29:47 |
| docker.io/argoproj/workflow-controller | v3.1.4 | argoproj_workflow-controller | 2021-08-04 02:30:08 |
| docker.io/argoproj/argoexec | v3.1.4 | argoproj_argoexec | 2021-08-04 02:30:48 |
| docker.io/argoproj/argocli | v3.1.5 | argoproj_argocli | 2021-08-04 08:20:00 |
| docker.io/argoproj/workflow-controller | v3.1.5 | argoproj_workflow-controller | 2021-08-04 08:20:19 |
| docker.io/argoproj/argoexec | v3.1.5 | argoproj_argoexec | 2021-08-04 08:20:57 |
| quay.io/jetstack/cert-manager-controller | v1.4.3 | jetstack_cert-manager-controller | 2021-08-06 14:16:31 |
| quay.io/jetstack/cert-manager-webhook | v1.4.3 | jetstack_cert-manager-webhook | 2021-08-06 14:16:50 |
| quay.io/jetstack/cert-manager-cainjector | v1.4.3 | jetstack_cert-manager-cainjector | 2021-08-06 14:17:08 |
| quay.io/jetstack/cert-manager-acmesolver | v1.4.3 | jetstack_cert-manager-acmesolver | 2021-08-06 14:17:26 |
| quay.io/keycloak/keycloak | 15.0.1 | keycloak_keycloak | 2021-08-07 10:18:17 |
| quay.io/jetstack/cert-manager-controller | v1.5.0 | jetstack_cert-manager-controller | 2021-08-11 14:16:41 |
| quay.io/jetstack/cert-manager-webhook | v1.5.0 | jetstack_cert-manager-webhook | 2021-08-11 14:17:00 |
| quay.io/jetstack/cert-manager-cainjector | v1.5.0 | jetstack_cert-manager-cainjector | 2021-08-11 14:17:20 |
| quay.io/jetstack/cert-manager-acmesolver | v1.5.0 | jetstack_cert-manager-acmesolver | 2021-08-11 14:17:40 |
| docker.io/argoproj/argocli | v3.1.6 | argoproj_argocli | 2021-08-13 00:55:10 |
| docker.io/argoproj/workflow-controller | v3.1.6 | argoproj_workflow-controller | 2021-08-13 00:55:33 |
| docker.io/argoproj/argoexec | v3.1.6 | argoproj_argoexec | 2021-08-13 00:56:14 |
| registry.opensource.zalan.do/acid/pgbouncer | master-16 | acid_pgbouncer | 2021-08-13 02:28:47 |
| quay.io/jetstack/cert-manager-controller | v1.5.1 | jetstack_cert-manager-controller | 2021-08-16 16:29:55 |
| quay.io/jetstack/cert-manager-webhook | v1.5.1 | jetstack_cert-manager-webhook | 2021-08-16 16:30:15 |
| quay.io/jetstack/cert-manager-cainjector | v1.5.1 | jetstack_cert-manager-cainjector | 2021-08-16 16:30:36 |
| quay.io/jetstack/cert-manager-acmesolver | v1.5.1 | jetstack_cert-manager-acmesolver | 2021-08-16 16:30:56 |
| docker.io/argoproj/argocli | v2.12.12 | argoproj_argocli | 2021-08-18 18:21:47 |
| docker.io/argoproj/workflow-controller | v2.12.12 | argoproj_workflow-controller | 2021-08-18 18:22:11 |
| docker.io/argoproj/argoexec | v2.12.12 | argoproj_argoexec | 2021-08-18 18:22:51 |
| docker.io/argoproj/argocli | v3.0.10 | argoproj_argocli | 2021-08-19 00:48:36 |
| docker.io/argoproj/workflow-controller | v3.0.10 | argoproj_workflow-controller | 2021-08-19 00:49:00 |
| docker.io/argoproj/argoexec | v3.0.10 | argoproj_argoexec | 2021-08-19 00:49:40 |
| docker.io/argoproj/argocd | v2.1.0 | argoproj_argocd | 2021-08-20 06:23:18 |
| quay.io/keycloak/keycloak | 15.0.2 | keycloak_keycloak | 2021-08-20 10:19:19 |
| quay.io/jetstack/cert-manager-controller | v1.5.2 | jetstack_cert-manager-controller | 2021-08-20 12:29:10 |
| quay.io/jetstack/cert-manager-webhook | v1.5.2 | jetstack_cert-manager-webhook | 2021-08-20 12:29:31 |
| quay.io/jetstack/cert-manager-cainjector | v1.5.2 | jetstack_cert-manager-cainjector | 2021-08-20 12:29:52 |
| quay.io/jetstack/cert-manager-acmesolver | v1.5.2 | jetstack_cert-manager-acmesolver | 2021-08-20 12:30:06 |
| quay.io/argoproj/argocd-applicationset | v0.2.0 | argoproj_argocd-applicationset | 2021-08-23 22:57:41 |
| k8s.gcr.io/ingress-nginx/controller | v0.49.0 | ingress-nginx_controller | 2021-08-23 22:58:52 |
| quay.io/jetstack/cert-manager-controller | v1.4.4 | jetstack_cert-manager-controller | 2021-08-24 16:27:55 |
| quay.io/jetstack/cert-manager-webhook | v1.4.4 | jetstack_cert-manager-webhook | 2021-08-24 16:28:18 |
| quay.io/jetstack/cert-manager-cainjector | v1.4.4 | jetstack_cert-manager-cainjector | 2021-08-24 16:28:39 |
| quay.io/jetstack/cert-manager-acmesolver | v1.4.4 | jetstack_cert-manager-acmesolver | 2021-08-24 16:29:00 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.0 | ingress-nginx_controller | 2021-08-24 16:29:33 |
| quay.io/jetstack/cert-manager-controller | v1.5.3 | jetstack_cert-manager-controller | 2021-08-24 18:21:17 |
| quay.io/jetstack/cert-manager-webhook | v1.5.3 | jetstack_cert-manager-webhook | 2021-08-24 18:21:41 |
| quay.io/jetstack/cert-manager-cainjector | v1.5.3 | jetstack_cert-manager-cainjector | 2021-08-24 18:22:04 |
| quay.io/jetstack/cert-manager-acmesolver | v1.5.3 | jetstack_cert-manager-acmesolver | 2021-08-24 18:22:20 |
| docker.io/argoproj/argocd | v2.1.1 | argoproj_argocd | 2021-08-25 16:28:40 |
| registry.opensource.zalan.do/acid/spilo-13 | 2.1-p1 | acid_spilo-13 | 2021-08-27 10:20:22 |
| registry.opensource.zalan.do/acid/postgres-operator | v1.7.0 | acid_postgres-operator | 2021-08-27 14:16:10 |
| registry.opensource.zalan.do/acid/logical-backup | v1.7.0 | acid_logical-backup | 2021-08-27 14:16:56 |
| registry.opensource.zalan.do/acid/postgres-operator-ui | v1.7.0 | acid_postgres-operator-ui | 2021-08-27 14:17:59 |
| docker.io/argoproj/argocd | v2.1.2 | argoproj_argocd | 2021-09-02 18:22:07 |
| docker.io/argoproj/argocli | v3.1.9 | argoproj_argocli | 2021-09-04 00:54:51 |
| docker.io/argoproj/workflow-controller | v3.1.9 | argoproj_workflow-controller | 2021-09-04 00:55:08 |
| docker.io/argoproj/argoexec | v3.1.9 | argoproj_argoexec | 2021-09-04 00:55:43 |
| docker.io/argoproj/argocli | v3.1.10 | argoproj_argocli | 2021-09-10 20:18:23 |
| docker.io/argoproj/workflow-controller | v3.1.10 | argoproj_workflow-controller | 2021-09-10 20:18:41 |
| docker.io/argoproj/argoexec | v3.1.10 | argoproj_argoexec | 2021-09-10 20:19:21 |
| docker.io/argoproj/argocli | v3.1.11 | argoproj_argocli | 2021-09-14 08:20:59 |
| docker.io/argoproj/workflow-controller | v3.1.11 | argoproj_workflow-controller | 2021-09-14 08:21:23 |
| docker.io/argoproj/argoexec | v3.1.11 | argoproj_argoexec | 2021-09-14 08:22:07 |
| docker.io/argoproj/argocli | v3.1.12 | argoproj_argocli | 2021-09-16 14:17:47 |
| docker.io/argoproj/workflow-controller | v3.1.12 | argoproj_workflow-controller | 2021-09-16 14:18:10 |
| docker.io/argoproj/argoexec | v3.1.12 | argoproj_argoexec | 2021-09-16 14:18:51 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.1 | ingress-nginx_controller | 2021-09-22 14:17:07 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.2 | ingress-nginx_controller | 2021-09-27 04:24:43 |
| k8s.gcr.io/ingress-nginx/kube-webhook-certgen | v1.0 | ingress-nginx_kube-webhook-certgen | 2021-09-27 15:11:43 |
| quay.io/thanos/thanos | v0.23.0 | thanos_thanos | 2021-09-27 16:29:33 |
| docker.io/argoproj/argocli | v3.1.13 | argoproj_argocli | 2021-09-28 20:17:53 |
| docker.io/argoproj/workflow-controller | v3.1.13 | argoproj_workflow-controller | 2021-09-28 20:18:12 |
| docker.io/argoproj/argoexec | v3.1.13 | argoproj_argoexec | 2021-09-28 20:18:49 |
| docker.io/argoproj/argocd | v2.1.3 | argoproj_argocd | 2021-09-29 22:19:06 |
| quay.io/jetstack/cert-manager-controller | v1.5.4 | jetstack_cert-manager-controller | 2021-09-30 18:20:41 |
| quay.io/jetstack/cert-manager-webhook | v1.5.4 | jetstack_cert-manager-webhook | 2021-09-30 18:20:57 |
| quay.io/jetstack/cert-manager-cainjector | v1.5.4 | jetstack_cert-manager-cainjector | 2021-09-30 18:21:14 |
| quay.io/jetstack/cert-manager-acmesolver | v1.5.4 | jetstack_cert-manager-acmesolver | 2021-09-30 18:21:27 |
| quay.io/thanos/thanos | v0.23.1 | thanos_thanos | 2021-10-05 12:28:56 |
| registry.opensource.zalan.do/acid/spilo-14 | 2.1-p2 | acid_spilo-14 | 2021-10-19 12:49:38 |
| docker.io/argoproj/argocli | v3.2.0 | argoproj_argocli | 2021-10-19 12:50:12 |
| docker.io/argoproj/workflow-controller | v3.2.0 | argoproj_workflow-controller | 2021-10-19 12:50:35 |
| docker.io/argoproj/argoexec | v3.2.0 | argoproj_argoexec | 2021-10-19 12:51:10 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.4 | ingress-nginx_controller | 2021-10-19 12:52:17 |
| docker.io/argoproj/argocli | v3.2.1 | argoproj_argocli | 2021-10-19 22:18:15 |
| docker.io/argoproj/workflow-controller | v3.2.1 | argoproj_workflow-controller | 2021-10-19 22:18:38 |
| docker.io/argoproj/argoexec | v3.2.1 | argoproj_argoexec | 2021-10-19 22:19:14 |
| docker.io/argoproj/argocd | v2.1.4 | argoproj_argocd | 2021-10-20 01:03:41 |
| gcr.io/kaniko-project/executor | v1.7.0 | kaniko-project_executor | 2021-10-20 04:22:52 |
| gcr.io/kaniko-project/executor | v1.7.0-debug | kaniko-project_executor | 2021-10-20 04:23:27 |
| docker.io/argoproj/argocli | v3.1.14 | argoproj_argocli | 2021-10-20 04:24:34 |
| docker.io/argoproj/workflow-controller | v3.1.14 | argoproj_workflow-controller | 2021-10-20 04:24:56 |
| docker.io/argoproj/argoexec | v3.1.14 | argoproj_argoexec | 2021-10-20 04:25:40 |
| docker.io/argoproj/argocd | v2.1.5 | argoproj_argocd | 2021-10-20 16:29:29 |
| docker.io/argoproj/argocli | v3.2.2 | argoproj_argocli | 2021-10-21 20:19:52 |
| docker.io/argoproj/workflow-controller | v3.2.2 | argoproj_workflow-controller | 2021-10-21 20:20:16 |
| docker.io/argoproj/argoexec | v3.2.2 | argoproj_argoexec | 2021-10-21 20:20:54 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.2.0 | oauth2-proxy_oauth2-proxy | 2021-10-23 10:18:31 |
| quay.io/jetstack/cert-manager-controller | v1.6.0 | jetstack_cert-manager-controller | 2021-10-26 16:28:09 |
| quay.io/jetstack/cert-manager-webhook | v1.6.0 | jetstack_cert-manager-webhook | 2021-10-26 16:28:31 |
| quay.io/jetstack/cert-manager-cainjector | v1.6.0 | jetstack_cert-manager-cainjector | 2021-10-26 16:28:53 |
| quay.io/jetstack/cert-manager-acmesolver | v1.6.0 | jetstack_cert-manager-acmesolver | 2021-10-26 16:29:15 |
| docker.io/argoproj/argocli | v3.2.3 | argoproj_argocli | 2021-10-27 02:30:07 |
| docker.io/argoproj/workflow-controller | v3.2.3 | argoproj_workflow-controller | 2021-10-27 02:30:32 |
| docker.io/argoproj/argoexec | v3.2.3 | argoproj_argoexec | 2021-10-27 02:31:12 |
| docker.io/argoproj/argocd | v2.1.6 | argoproj_argocd | 2021-10-28 20:25:16 |
| quay.io/jetstack/cert-manager-controller | v1.6.1 | jetstack_cert-manager-controller | 2021-11-01 14:17:38 |
| quay.io/jetstack/cert-manager-webhook | v1.6.1 | jetstack_cert-manager-webhook | 2021-11-01 14:17:55 |
| quay.io/jetstack/cert-manager-cainjector | v1.6.1 | jetstack_cert-manager-cainjector | 2021-11-01 14:18:12 |
| quay.io/jetstack/cert-manager-acmesolver | v1.6.1 | jetstack_cert-manager-acmesolver | 2021-11-01 14:18:22 |
| registry.opensource.zalan.do/acid/spilo-14 | 2.1-p3 | acid_spilo-14 | 2021-11-03 10:20:39 |
| registry.opensource.zalan.do/acid/postgres-operator | v1.7.1 | acid_postgres-operator | 2021-11-03 20:19:04 |
| registry.opensource.zalan.do/acid/logical-backup | v1.7.1 | acid_logical-backup | 2021-11-03 20:19:57 |
| registry.opensource.zalan.do/acid/postgres-operator-ui | v1.7.1 | acid_postgres-operator-ui | 2021-11-03 20:21:03 |
| k8s.gcr.io/ingress-nginx/controller | v1.0.5 | ingress-nginx_controller | 2021-11-17 14:14:45 |
| docker.io/argoproj/argocli | v3.1.15 | argoproj_argocli | 2021-11-17 20:19:49 |
| docker.io/argoproj/workflow-controller | v3.1.15 | argoproj_workflow-controller | 2021-11-17 20:20:08 |
| docker.io/argoproj/argoexec | v3.1.15 | argoproj_argoexec | 2021-11-17 20:20:46 |
| docker.io/argoproj/argocli | v3.2.4 | argoproj_argocli | 2021-11-18 00:58:10 |
| docker.io/argoproj/workflow-controller | v3.2.4 | argoproj_workflow-controller | 2021-11-18 00:58:29 |
| docker.io/argoproj/argoexec | v3.2.4 | argoproj_argoexec | 2021-11-18 00:59:01 |
| docker.io/argoproj/argocd | v2.1.7 | argoproj_argocd | 2021-11-18 01:00:14 |
| k8s.gcr.io/ingress-nginx/kube-webhook-certgen | v1.1.1 | ingress-nginx_kube-webhook-certgen | 2021-11-18 10:02:35 |
| k8s.gcr.io/ingress-nginx/controller | v1.1.0 | ingress-nginx_controller | 2021-11-24 00:58:37 |
| k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner | v4.0.2 | sig-storage_nfs-subdir-external-provisioner | 2021-12-05 18:21:25 |
| quay.io/keycloak/keycloak | 15.1.0 | keycloak_keycloak | 2021-12-10 16:28:24 |
| docker.io/argoproj/argocd | v2.1.8 | argoproj_argocd | 2021-12-14 01:04:53 |
| docker.io/argoproj/argocd | v2.2.0 | argoproj_argocd | 2021-12-14 18:23:23 |
| docker.io/argoproj/argocli | v3.2.5 | argoproj_argocli | 2021-12-16 01:00:31 |
| docker.io/argoproj/workflow-controller | v3.2.5 | argoproj_workflow-controller | 2021-12-16 01:00:54 |
| docker.io/argoproj/argoexec | v3.2.5 | argoproj_argoexec | 2021-12-16 01:01:31 |
| quay.io/bitnami/sealed-secrets-controller | v0.17.1 | bitnami_sealed-secrets-controller | 2021-12-16 12:44:34 |
| quay.io/argoproj/argocd-applicationset | v0.3.0 | argoproj_argocd-applicationset | 2021-12-16 16:30:49 |
| docker.io/argoproj/argocd | v2.2.1 | argoproj_argocd | 2021-12-17 02:37:55 |
| quay.io/keycloak/keycloak | 16.0.0 | keycloak_keycloak | 2021-12-18 08:21:57 |
| docker.io/argoproj/argocli | v3.2.6 | argoproj_argocli | 2021-12-18 08:23:28 |
| docker.io/argoproj/workflow-controller | v3.2.6 | argoproj_workflow-controller | 2021-12-18 08:23:51 |
| docker.io/argoproj/argoexec | v3.2.6 | argoproj_argoexec | 2021-12-18 08:24:19 |
| quay.io/keycloak/keycloak | 16.1.0 | keycloak_keycloak | 2021-12-20 16:30:22 |
| quay.io/thanos/thanos | v0.23.2 | thanos_thanos | 2021-12-22 14:18:40 |
| quay.io/oauth2-proxy/oauth2-proxy | v7.2.1 | oauth2-proxy_oauth2-proxy | 2021-12-22 18:21:46 |
| quay.io/thanos/thanos | v0.24.0 | thanos_thanos | 2021-12-22 18:23:35 |
| docker.io/argoproj/argocd | v2.2.2 | argoproj_argocd | 2022-01-01 08:23:55 |
| gcr.io/cadvisor/cadvisor | v0.39.3 | cadvisor_cadvisor | 2022-01-06 01:08:15 |
| quay.io/jetstack/cert-manager-ctl | v1.6.1 | jetstack_cert-manager-ctl | 2022-01-11 14:01:50 |
| k8s.gcr.io/ingress-nginx/controller | v1.1.1 | ingress-nginx_controller | 2022-01-12 18:23:42 |
| quay.io/bitnami/sealed-secrets-controller | v0.17.2 | bitnami_sealed-secrets-controller | 2022-01-13 16:31:00 |
| docker.io/argoproj/argocd | v2.2.3 | argoproj_argocd | 2022-01-18 18:24:27 |
| quay.io/keycloak/keycloak | 16.1.1 | keycloak_keycloak | 2022-01-25 16:26:42 |
| quay.io/jetstack/cert-manager-controller | v1.7.0 | jetstack_cert-manager-controller | 2022-01-26 20:18:45 |
| quay.io/jetstack/cert-manager-webhook | v1.7.0 | jetstack_cert-manager-webhook | 2022-01-26 20:19:05 |
| quay.io/jetstack/cert-manager-cainjector | v1.7.0 | jetstack_cert-manager-cainjector | 2022-01-26 20:19:24 |
| quay.io/jetstack/cert-manager-acmesolver | v1.7.0 | jetstack_cert-manager-acmesolver | 2022-01-26 20:19:43 |
| quay.io/jetstack/cert-manager-ctl | v1.7.0 | jetstack_cert-manager-ctl | 2022-01-26 20:20:05 |
| quay.io/bitnami/sealed-secrets-controller | v0.17.3 | bitnami_sealed-secrets-controller | 2022-01-27 16:27:31 |
| docker.io/argoproj/argocli | v3.2.7 | argoproj_argocli | 2022-01-28 02:33:19 |
| docker.io/argoproj/workflow-controller | v3.2.7 | argoproj_workflow-controller | 2022-01-28 02:33:39 |
| docker.io/argoproj/argoexec | v3.2.7 | argoproj_argoexec | 2022-01-28 02:34:11 |
| ghcr.io/dexidp/dex | v2.30.3 | dexidp_dex | 2022-02-02 20:19:20 |

