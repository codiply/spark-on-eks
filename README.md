# Spark on EKS

## Setup

- `cd infrastructure/data` and `./download.sh`
- Make a copy of `infrastructure/config/default.deployment.template.yaml` to `/infrastructure/config/default.deployment.yaml` and populate it
- Create file `infrastructure/config/aws-profile.txt` and store your aws profile to use (as named in `~/.aws/config`)

## Deploy

You can deploy from the `infrastructure/` directory with

```
./cdk.sh deploy
```

1. Deploy first with all the switches in `DeployJobs` in `infrastructure/config/default.yaml` set to `'false'` (at the moment I cannot deploy everything in one go; the dependencies are not enough)
2. Then deploy a second time with the job you wish to deploy switched on