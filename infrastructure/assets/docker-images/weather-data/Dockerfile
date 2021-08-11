ARG SPARK_VERSION=3.1.1
ARG HADOOP_VERSION=3.3.1

FROM ubuntu:bionic as downloader

ARG HADOOP_VERSION=3.3.1
ARG AWS_SDK_BUNDLE_VERSION=1.11.901

RUN apt-get update && apt-get install -y \
  wget \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar -P /tmp/spark-jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_BUNDLE_VERSION}/aws-java-sdk-bundle-${AWS_SDK_BUNDLE_VERSION}.jar -P /tmp/spark-jars/

FROM public.ecr.aws/z2m5w4m3/spark-operator/spark-py:v${SPARK_VERSION}-hadoop${HADOOP_VERSION}

USER root

COPY --from=downloader /tmp/spark-jars/* $SPARK_HOME/jars/
COPY application.py /opt/spark-job/application.py