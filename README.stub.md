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
