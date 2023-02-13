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
from dotenv import load_dotenv


class DatabaseStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        load_dotenv()
        # The code that defines your stack goes here

        # vpc = ec2.Vpc(
        #     self, "VPC",
        # )

        # create a public vpc
        vpc = ec2.Vpc(
            self, "lguerra-cube-db-vpc",
            max_azs=2,
            nat_gateways=1,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    name="private",
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_NAT,
                    cidr_mask=24
                ),
            ],
        )

        securitygroup = ec2.SecurityGroup(
            self, "lguerra-cube-db-sg",
            vpc=vpc,
            allow_all_outbound=True,
            security_group_name="lguerra-cube-db-sg",
        )

        # Create a PostgreSQL database instance
        db = rds.DatabaseInstance(
            self, "lguerra-cube-db",
            # engine=rds.DatabaseInstanceEngine.postgres(
            #     version=rds.PostgresEngineVersion.
            # ),
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.of("14.2", "14")),
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO
            ),
            vpc=vpc,
            vpc_subnets={
                "subnet_type": ec2.SubnetType.PUBLIC
            },
            security_groups=[securitygroup],
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
