#!/bin/sh -l

cp .env.staging-env .env.production
cp .env.staging-env.local .env.production.local
yarn build
aws s3 cp build s3://staging.karakuri.farm --recursive --exclude .DS_Store
aws cloudfront create-invalidation --distribution-id EW2H0JKSXZQ6B --paths /\*
