#!/bin/bash
set -ex

source ./scripts/sync-image
source ./scripts/github-latest-version
source ./scripts/chart-app-version


# latest stable
sync-image quay.io/keycloak/keycloak $(github-latest-version keycloak/keycloak)
sync-image gcr.io/cadvisor/cadvisor $(github-latest-version google/cadvisor)

sync-image quay.io/oauth2-proxy/oauth2-proxy $(github-latest-version oauth2-proxy/oauth2-proxy)

sync-image gcr.io/kaniko-project/executor $(github-latest-version GoogleContainerTools/kaniko)
sync-image gcr.io/kaniko-project/executor $(github-latest-version GoogleContainerTools/kaniko)-debug
sync-image gcr.io/kaniko-project/executor debug
sync-image gcr.io/kaniko-project/executor latest
sync-image gcr.io/k8s-skaffold/skaffold-helpers/busybox latest

# postgres-operator
sync-image registry.opensource.zalan.do/acid/postgres-operator $(github-latest-version zalando/postgres-operator)
sync-image registry.opensource.zalan.do/acid/logical-backup $(github-latest-version zalando/postgres-operator)
sync-image registry.opensource.zalan.do/acid/postgres-operator-ui $(github-latest-version zalando/postgres-operator)

sync-image registry.opensource.zalan.do/acid/spilo-13 $(github-latest-version zalando/spilo)
sync-image registry.opensource.zalan.do/acid/pgbouncer master-16

# nfs
sync-image k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner v$(chart-app-version nfs-subdir-external-provisioner)

# argo
sync-image docker.io/argoproj/argocli $(github-latest-version argoproj/argo-workflows)
sync-image docker.io/argoproj/workflow-controller $(github-latest-version argoproj/argo-workflows)
sync-image docker.io/argoproj/argoexec $(github-latest-version argoproj/argo-workflows)

# argo-cd
sync-image docker.io/argoproj/argocd $(github-latest-version argoproj/argo-cd)
sync-image quay.io/argoproj/argocd-applicationset $(github-latest-version argoproj-labs/applicationset)
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

sync-image k8s.gcr.io/ingress-nginx/controller v$(chart-app-version ingress-nginx)

# sync-image gcr.io/google_containers/defaultbackend 1.0

sync-image docker.io/jettech/kube-webhook-certgen v1.0
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
