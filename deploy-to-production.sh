#!/bin/sh -l

cp .env.production-env .env.production
cp .env.production-env.local .env.production.local
yarn build
aws s3 cp build s3://karakuri.farm --recursive --exclude .DS_Store
aws cloudfront create-invalidation --distribution-id E3QY46YGHFXMOK --paths /\*
