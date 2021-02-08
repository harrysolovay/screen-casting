import * as cdk from "@aws-cdk/core";
import { RestApiStack } from "./rest-api";
import { GraphqlApiStack } from "./graphql-api";
import { buildSync } from "esbuild";
import path from "path";

["rest-api", "graphql-api"].forEach((lambdaDir) => {
  buildSync({
    bundle: true,
    entryPoints: [path.resolve(__dirname, lambdaDir, "lambda", "index.ts")],
    external: ["aws-sdk"],
    format: "cjs",
    outfile: path.join(__dirname, lambdaDir, "lambda-dist", "index.js"),
    platform: "node",
    sourcemap: true,
    target: "node12.2",
  });
});

const app = new cdk.App();
const idPrefix = "screen-casting-";
new RestApiStack(app, `${idPrefix}rest-api`);
new GraphqlApiStack(app, `${idPrefix}api-stack`);
