#!/bin/bash
set -e

: ${MIRROR_REGISTRY:=registry.cn-shanghai.aliyuncs.com}

gcr_sync_image(){
  local src=gcr.io
  local target=$MIRROR_REGISTRY/gcr-sync
  
  local name=$1
  local ver=$2
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
    sync_image $src_repo $target_repo
  fi
}
sync_image(){
  echo Syncing $1 to $2

  docker pull $1
  docker tag $1 $2
  docker push $2
}

gcr_sync_image  cadvisor/cadvisor v0.36.0
gcr_sync_image  cadvisor/cadvisor v0.37.0
gcr_sync_image  cadvisor/cadvisor latest
gcr_sync_image  google-containers/pause latest
