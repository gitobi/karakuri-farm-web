#!/bin/sh -l

cp .env.staging-env .env.production
cp .env.staging-env.local .env.production.local
ls -la
cat .env.production
cat .env.production.local
yarn build
