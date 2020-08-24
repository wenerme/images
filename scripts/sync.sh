#!/bin/bash
set -ex

# : ${MIRROR_REGISTRY:=registry.cn-shanghai.aliyuncs.com}
: ${MIRROR_REGISTRY:=registry.cn-hongkong.aliyuncs.com}

sync_image(){
  # cmi - container mirror image
  local target=$MIRROR_REGISTRY/cmi

  local name=$1
  local ver=$2

  local src=${name%%/*}
  name=${name##$src/}
  if [ $src = "k8s.gcr.io" ]; then
    src="gcr.io"
    name="google-containers/${name}"
  fi

  local target_name=${name//\//_}

  local src_repo=$src/$name:$ver
  local target_repo=$target/$target_name:$ver

  echo "Checking $1:$2 -> $target_repo"

  local sync=
  if [ "$ver" = "latest" ]; then
    sync=1
  else
    DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $target_repo &> /dev/null || {
      sync=1
    }
  fi
  
  if [ -n "$sync" ]; then 
    _sync_image $src_repo $target_repo
    [ $ver == "latest" ] || {
      echo -n "update ${1%%/*}:$ver ." >> message
      echo "| $1 | $2 | $target_name | $(date +"%Y-%m-%d %H:%M:%S") |" >> CHANGELOG.md
    }

    # as alternative to k8s.gcr.io
    [[ "$name" =~ "google-containers/" ]] && {
      docker tag $target_repo $target/${name##*/}:$ver
    } || true
  fi
}

_sync_image(){
  echo Syncing $1 to $2

  docker pull $1
  docker tag $1 $2
  docker push $2
}

github-latest-version(){
  curl -sL https://api.github.com/repos/$1/releases/latest | jq .tag_name -r
}

# latest stable
sync_image gcr.io/cadvisor/cadvisor $(github-latest-version google/cadvisor)
#
sync_image gcr.io/google-containers/pause 3.0
sync_image gcr.io/google-containers/pause 3.1
sync_image gcr.io/google-containers/pause 3.2
sync_image gcr.io/google-containers/pause latest

sync_image k8s.gcr.io/defaultbackend-amd64 1.5

# quay.io/kubernetes-ingress-controller/nginx-ingress-controller
sync_image quay.io/kubernetes-ingress-controller/nginx-ingress-controller 0.33.0
sync_image us.gcr.io/k8s-artifacts-prod/ingress-nginx/controller v0.34.1
sync_image gcr.io/google_containers/defaultbackend 1.0

ver=$(github-latest-version jetstack/cert-manager)
sync_image quay.io/jetstack/cert-manager-controller $ver
sync_image quay.io/jetstack/cert-manager-webhook $ver
sync_image quay.io/jetstack/cert-manager-cainjector $ver

ver=$(github-latest-version thanos-io/thanos)
sync_image quay.io/thanos-io/thanos $ver

sync_image docker.io/jettech/kube-webhook-certgen v1.2.2





#
cat README.stub.md > README.md
echo >> README.md
cat  CHANGELOG.md >> README.md
echo >> README.md
