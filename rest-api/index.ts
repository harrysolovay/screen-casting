import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import path from "path";

export class RestApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, "handler", {
      code: new lambda.AssetCode(path.resolve(__dirname, "lambda-dist")),
      handler: "index.helloWorldHandler",
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    new apigw.LambdaRestApi(this, "rest-api", { handler });
  }
}
