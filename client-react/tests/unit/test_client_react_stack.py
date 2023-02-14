import aws_cdk as core
import aws_cdk.assertions as assertions

from client_react.client_react_stack import ClientReactStack

# example tests. To run these tests, uncomment this file along with the example
# resource in client_react/client_react_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = ClientReactStack(app, "client-react")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
