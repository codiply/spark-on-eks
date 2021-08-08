#!/bin/bash

set -euo pipefail

mkdir -p weather

for year in {2020..2020}
do
  filename="${year}.csv.gz"
  url="ftp://ftp.ncdc.noaa.gov/pub/data/ghcn/daily/by_year/${filename}"

  echo "Downloading year $year"
  wget -O "weather/$filename" $url
done