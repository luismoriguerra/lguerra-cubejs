from aws_cdk import (
    # Duration,
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cf,
    aws_s3_deployment as s3_deployment,
    # aws_sqs as sqs,
    CfnOutput,
    RemovalPolicy
)
from constructs import Construct


class ClientReactStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here
        app_bucket = s3.Bucket(
            self, "cubereact-app-bucket",
            website_index_document="index.html",
            website_error_document="index.html",
            public_read_access=True,
            removal_policy=RemovalPolicy.DESTROY,
        )

        cf_dist = cf.CloudFrontWebDistribution(
            self, "cubereact-cloudfront",
            origin_configs=[
                cf.SourceConfiguration(
                    s3_origin_source=cf.S3OriginConfig(
                        s3_bucket_source=app_bucket),
                    behaviors=[cf.Behavior(is_default_behavior=True)])])

        s3_deployment.BucketDeployment(
            self, "cubereact-app-bucket-deployment",
            sources=[s3_deployment.Source.asset(
                path="./app/dist")],
            destination_bucket=app_bucket,
            distribution=cf_dist,
            distribution_paths=["/*"]
        )

        CfnOutput(
            self, "cubereact-cloudfront-url",
            value=cf_dist.distribution_domain_name)
        # example resource
        # queue = sqs.Queue(
        #     self, "ClientReactQueue",
        #     visibility_timeout=Duration.seconds(300),
        # )
