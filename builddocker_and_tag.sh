#!/bin/bash

IMAGE_NAME="$DOCKER_USER"/heatmap
BUILD_ID=`docker build . -t $IMAGE_NAME | grep "Successfully built" | awk '{print $3}'`
taglist="latest $TAG"
for i in $taglist
do
    echo "create image: $IMAGE_NAME with tag $i"
    docker tag $BUILD_ID $IMAGE_NAME:$i
done

echo "publishing docker image to $IMAGE_NAME with tags latest, $TAG "
docker push $IMAGE_NAME