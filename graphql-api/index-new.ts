import * as cdk from "@aws-cdk/core";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as appsync from "@aws-cdk/aws-appsync";
import path from "path";
import { C } from "concise-constructs";

export const GraphqlApiStack = C(cdk.Stack, (def) => {
  const api = def`graphql-api`(appsync.GraphqlApi, {
    name: "graphql-api",
    schema: appsync.Schema.fromAsset(path.resolve(__dirname, "schema.gql")),
    xrayEnabled: true,
  });

  def`graphqlUrl`(cdk.CfnOutput, {
    exportName: "graphqlUrl",
    value: api.graphqlUrl,
  });

  const db = def`db`(ddb.Table, {
    billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: "id",
      type: ddb.AttributeType.STRING,
    },
  });

  [
    { typeName: "Query", fieldName: "note", access: ["dynamodb:GetItem"] },
    { typeName: "Query", fieldName: "notes", access: ["dynamodb:Scan"] },
    {
      typeName: "Mutation",
      fieldName: "createNote",
      access: ["dynamodb:PutItem"],
    },
    {
      typeName: "Mutation",
      fieldName: "deleteNote",
      access: ["dynamodb:DeleteItem"],
    },
  ].forEach(({ access, ...props }) => {
    const id = `${props.fieldName}Handler`;

    const handler = def`${id}`(lambda.Function, {
      code: new lambda.AssetCode(path.resolve(__dirname, "lambda-dist")),
      environment: {
        TABLE_NAME: db.tableName,
      },
      handler: `index.${id}`,
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    db.grant(handler, ...access);

    api
      .addLambdaDataSource(`${props.fieldName}DataSource`, handler)
      .createResolver(props);
  });
});
