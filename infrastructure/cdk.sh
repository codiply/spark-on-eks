#!/bin/bash

set -euo pipefail

cdk --profile $(cat ./config/aws-profile.txt) "${@}"
