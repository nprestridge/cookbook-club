#!/bin/bash

set -e

cp src/config/local.json.ci src/config/local.json
sed -e "s/API_ENDPOINT/${API_ENDPOINT}/g" -e "s/API_KEY/${API_KEY}/g" src/config/production.json.ci > src/config/production.json
