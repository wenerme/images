#!/bin/bash
set -ex

source ./scripts/sync-image

github-latest-version(){
  curl -sL https://api.github.com/repos/$1/releases/latest | jq .tag_name -r
}

# latest stable
sync-image gcr.io/cadvisor/cadvisor $(github-latest-version google/cadvisor)
#
sync-image gcr.io/google-containers/pause 3.0
sync-image gcr.io/google-containers/pause 3.1
sync-image gcr.io/google-containers/pause 3.2

sync-image k8s.gcr.io/defaultbackend-amd64 1.5

# quay.io/kubernetes-ingress-controller/nginx-ingress-controller
# sync-image quay.io/kubernetes-ingress-controller/nginx-ingress-controller 0.33.0
# sync-image us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller v0.34.1
sync-image k8s.gcr.io/ingress-nginx/controller v0.35.0

sync-image gcr.io/google_containers/defaultbackend 1.0


ver=$(github-latest-version jetstack/cert-manager)
sync-image quay.io/jetstack/cert-manager-controller $ver
sync-image quay.io/jetstack/cert-manager-webhook $ver
sync-image quay.io/jetstack/cert-manager-cainjector $ver

ver=$(github-latest-version thanos-io/thanos)
sync-image quay.io/thanos/thanos $ver

sync-image docker.io/jettech/kube-webhook-certgen v1.2.2

# linkerd2
for i in proxy proxy-init controller debug web grafana; do
  sync-image gcr.io/linkerd-io/$i stable-2.8.1
done

#
cat README.stub.md > README.md
echo >> README.md
cat  CHANGELOG.md >> README.md
echo >> README.md
