from aws_cdk import (
    Duration,
    Stack,
    aws_sqs as sqs,
    RemovalPolicy,
    aws_rds as rds,
    aws_ec2 as ec2,
    SecretValue,
)
from constructs import Construct
import os


class DatabaseStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here

        # example resource
        # queue = sqs.Queue(
        #     self, "DatabaseQueue",
        #     visibility_timeout=Duration.seconds(300),
        # )
        vpc = ec2.Vpc(
            self, "VPC",
        )

        # Create a PostgreSQL database instance
        db = rds.DatabaseInstance(
            self, "lguerra-cube-db",
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_12_3
            ),
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO
            ),
            vpc=vpc,
            vpc_subnets={
                "subnet_type": ec2.SubnetType.PUBLIC
            },
            publicly_accessible=True,
            multi_az=False,
            deletion_protection=False,
            backup_retention=Duration.days(1),
            removal_policy=RemovalPolicy.DESTROY,
            database_name=os.environ["DB_NAME"],
            credentials=rds.Credentials.from_password(
                username=os.environ["DB_USER"],
                password=SecretValue.plain_text(os.environ["DB_PASS"])
            ),
        )
