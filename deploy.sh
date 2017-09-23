#!/bin/sh -l

yarn build
aws s3 cp build s3://karakuri.farm --recursive --exclude .DS_Store
aws cloudfront create-invalidation --distribution-id E3QY46YGHFXMOK --paths /\*
