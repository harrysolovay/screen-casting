import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import path from "path";
import { C } from "concise-constructs";

export const RestApiStack = C(cdk.Stack, (def) => {
  const handler = def`handler`(lambda.Function, {
    code: new lambda.AssetCode(path.resolve(__dirname, "lambda-dist")),
    handler: "index.helloWorldHandler",
    runtime: lambda.Runtime.NODEJS_12_X,
  });

  def`rest-api`(apigw.LambdaRestApi, { handler });
});
