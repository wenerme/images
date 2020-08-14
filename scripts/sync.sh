#!/bin/bash

: ${MIRROR_REGISTRY:=registry.cn-shanghai.aliyuncs.com}

gcr_sync_image(){
  local src=gcr.io
  local target=$MIRROR_REGISTRY/gcr-sync
  
  local name=$1
  local ver=$2
  local target_name=${name//\//_}

  local src_repo=$src/$name:$ver
  local target_repo=$target/$target_name:$ver

  DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect $target_repo &> /dev/null || {
    echo Syncing $src_repo to $target_repo

    docker pull $src_repo
    docker tag $src_repo $target_repo
    docker push $target_repo
  }
}

gcr_sync_image  cadvisor/cadvisor v0.36.0
gcr_sync_image  cadvisor/cadvisor v0.37.0
