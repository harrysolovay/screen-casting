import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../generated-types";
import { TableName, db } from "./common";

export const handler: AppSyncResolverHandler<
  undefined,
  t.Query["notes"]
> = async () => {
  try {
    const { Items } = await db.scan({ TableName }).promise();
    return Items as t.Query["notes"];
  } catch (e) {
    return [];
  }
};
