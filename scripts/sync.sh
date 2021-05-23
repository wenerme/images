#!/bin/bash
set -ex

source ./scripts/sync-image

github-latest-version(){
  curl -sL https://api.github.com/repos/$1/releases/latest | jq .tag_name -r
}

# latest stable
sync-image quay.io/keycloak/keycloak $(github-latest-version keycloak/keycloak)
sync-image gcr.io/cadvisor/cadvisor $(github-latest-version google/cadvisor)

sync-image quay.io/oauth2-proxy/oauth2-proxy $(github-latest-version oauth2-proxy/oauth2-proxy)

sync-image gcr.io/kaniko-project/executor $(github-latest-version GoogleContainerTools/kaniko)
sync-image gcr.io/kaniko-project/executor $(github-latest-version GoogleContainerTools/kaniko)-debug
sync-image gcr.io/kaniko-project/executor debug
sync-image gcr.io/kaniko-project/executor latest

# postgres-operator
sync-image registry.opensource.zalan.do/acid/postgres-operator $(github-latest-version zalando/postgres-operator)
sync-image registry.opensource.zalan.do/acid/logical-backup $(github-latest-version zalando/postgres-operator)
sync-image registry.opensource.zalan.do/acid/postgres-operator-ui $(github-latest-version zalando/postgres-operator)

sync-image registry.opensource.zalan.do/acid/spilo-13 $(github-latest-version zalando/spilo)
sync-image registry.opensource.zalan.do/acid/pgbouncer master-16


# argo
sync-image docker.io/argoproj/argocli $(github-latest-version argoproj/argo)
sync-image docker.io/argoproj/workflow-controller $(github-latest-version argoproj/argo)
sync-image docker.io/argoproj/argoexec $(github-latest-version argoproj/argo)

# argo-cd
sync-image docker.io/argoproj/argocd $(github-latest-version argoproj/argo-cd)
# argocd use dex
sync-image ghcr.io/dexidp/dex $(github-latest-version dexidp/dex)

sync-image quay.io/bitnami/sealed-secrets-controller $(github-latest-version bitnami-labs/sealed-secrets)

ver=$(github-latest-version jetstack/cert-manager)
sync-image quay.io/jetstack/cert-manager-controller $ver
sync-image quay.io/jetstack/cert-manager-webhook $ver
sync-image quay.io/jetstack/cert-manager-cainjector $ver
sync-image quay.io/jetstack/cert-manager-acmesolver $ver

ver=$(github-latest-version thanos-io/thanos)
sync-image quay.io/thanos/thanos $ver


# static
# sync-image gcr.io/google-containers/pause 3.0
# sync-image gcr.io/google-containers/pause 3.1
# sync-image gcr.io/google-containers/pause 3.2
# sync-image k8s.gcr.io/defaultbackend-amd64 1.5

# quay.io/kubernetes-ingress-controller/nginx-ingress-controller
# sync-image quay.io/kubernetes-ingress-controller/nginx-ingress-controller 0.33.0
# sync-image us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller v0.34.1
# sync-image k8s.gcr.io/ingress-nginx/controller v0.41.2
# sync-image k8s.gcr.io/ingress-nginx/controller v0.43.0
# sync-image k8s.gcr.io/ingress-nginx/controller v0.44.0
sync-image k8s.gcr.io/ingress-nginx/controller v0.46.0

# sync-image gcr.io/google_containers/defaultbackend 1.0

# sync-image docker.io/jettech/kube-webhook-certgen v1.5.0
# sync-image docker.io/jettech/kube-webhook-certgen v1.5.1

# for i in proxy controller debug web grafana cni-plugin; do
#  sync-image gcr.io/linkerd-io/$i stable-2.8.1
# done
# sync-image gcr.io/linkerd-io/proxy-init v1.3.3


#
cat README.stub.md > README.md
echo >> README.md
cat  CHANGELOG.md >> README.md
echo >> README.md
