# Spark on EKS

## Setup

- `cd infrastructure/data` and `./download.sh`
- Make a copy of `infrastructure/config/default.deployment.template.yaml` to `/infrastructure/config/default.deployment.yaml` and populate it
- Create file `infrastructure/config/aws-profile.txt` and store your aws profile to use (as named in `~/.aws/config`)

## Deploy

The `infrastructure/` directory contains an [AWS CDK project](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) written [in TypeScript](https://docs.aws.amazon.com/de_de/cdk/latest/guide/work-with-cdk-typescript.html).

From the `infrastructure/` directory run

```
./cdk.sh deploy
```

At the moment, I cannot deploy everything in one go (using dependencies is not enough), so it needs to be done in two steps:

1. Deploy first with all the switches in `DeployJobs` in `infrastructure/config/default.yaml` set to `'false'`
2. Then deploy a second time with the job you wish to deploy switched on