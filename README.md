# Spark on EKS

## Setup

- `cd infrastructure/data` and `./download.sh`
- Make a copy of `infrastructure/config/default.deployment.template.yaml` to `/infrastructure/config/default.deployment.yaml` and populate it
- Create file `infrastructure/config/aws-profile.txt` and store your aws profile to use (as named in `~/.aws/config`)

## Build Spark image with custom Hadoop version

- Clone the spark repository `git clone git@github.com:apache/spark.git`
- Checkout a specific version `git checkout v3.1.1`
- Create repository `spark-py` and `spark`

Login to ECR with docker, for private repository:

```
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account id>.dkr.ecr.<region>.amazonaws.com
```

for public repository

```
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

Build Spark with a specific Hadoop Version

```
./build/mvn -Pkubernetes -Dhadoop.version=3.3.1 -DskipTests clean package
```

Build and tag the docker image

```
./bin/docker-image-tool.sh -r public.ecr.aws/z2m5w4m3 -t v3.1.1-hadoop3.3.1 -p ./resource-managers/kubernetes/docker/src/main/dockerfiles/spark/bindings/python/Dockerfile build
```

Push the image 

```
./bin/docker-image-tool.sh -r public.ecr.aws/z2m5w4m3 -t v3.1.1-hadoop3.3.1 push
```

## Deploy

The `infrastructure/` directory contains an [AWS CDK project](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) written [in TypeScript](https://docs.aws.amazon.com/de_de/cdk/latest/guide/work-with-cdk-typescript.html).

From the `infrastructure/` directory run

```
./cdk.sh deploy
```

At the moment, I cannot deploy everything in one go (using dependencies is not enough), so it needs to be done in two steps:

1. Deploy first with all the switches in `DeployJobs` in `infrastructure/config/default.yaml` set to `'false'`
2. Then deploy a second time with the job you wish to deploy switched on

## Versions

- Your Hadoop version will determine what version of [hadoop-aws](https://mvnrepository.com/artifact/org.apache.hadoop/hadoop-aws) you will use
- This in turn will determine what version of [aws-java-sdk-bundle](https://mvnrepository.com/artifact/org.apache.hadoop/aws-java-sdk-bundle) you need to use
