#!/bin/sh -l

cp .env.staging-env .env.production
cp .env.staging-env.local .env.production.local
yarn build
