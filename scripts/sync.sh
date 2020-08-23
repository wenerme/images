#!/bin/bash
set -e

: ${MIRROR_REGISTRY:=registry.cn-shanghai.aliyuncs.com}

sync_image(){
  # cmi - container mirror image
  local target=$MIRROR_REGISTRY/cmi

  local name=$1
  local ver=$2

  local src=${name%%/*}
  name=${name##$src/}
  if [ src = "k8s.gcr.io" ]; then
    src="gcr.io"
    name="google-containers/${name}"
  fi

  local target_name=${name//\//_}

  local src_repo=$src/$name:$ver
  local target_repo=$target/$target_name:$ver

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
  fi
}
_sync_image(){
  echo Syncing $1 to $2

  docker pull $1
  docker tag $1 $2
  docker push $2
}

sync_image gcr.io/cadvisor/cadvisor v0.36.0
# latest stable
sync_image gcr.io/cadvisor/cadvisor $(curl -sL https://api.github.com/repos/google/cadvisor/releases/latest | jq .tag_name -r)
#
sync_image gcr.io/google-containers/pause latest
sync_image k8s.gcr.io/defaultbackend-amd64 1.5

# quay.io/kubernetes-ingress-controller/nginx-ingress-controller
sync_image quay.io/kubernetes-ingress-controller/nginx-ingress-controller 0.33.0
sync_image docker.io/jettech/kube-webhook-certgen v1.2.2


