#!/bin/sh -l

cp .env.production-env .env.production
cp .env.production-env.local .env.production.local
yarn build
