ARG SPARK_VERSION

FROM ubuntu:bionic as downloader

ARG HADOOP_VERSION
ARG AWS_SDK_VERSION

RUN apt-get update && apt-get install -y \
  wget \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-common/${HADOOP_VERSION}/hadoop-common-${HADOOP_VERSION}.jar -P /tmp/spark-jars/
RUN wget https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/${HADOOP_VERSION}/hadoop-aws-${HADOOP_VERSION}.jar -P /tmp/spark-jars/
RUN wget https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/${AWS_SDK_VERSION}/aws-java-sdk-bundle-${AWS_SDK_VERSION}.jar -P /tmp/spark-jars/


FROM gcr.io/spark-operator/spark-py:v${SPARK_VERSION}

USER root

COPY --from=downloader /tmp/spark-jars/* $SPARK_HOME/jars/
COPY application.py /opt/spark-job/application.py

RUN pip install boto3