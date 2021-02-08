import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../generated-types";
import { TableName, db } from "./common";

export const handler: AppSyncResolverHandler<
  t.QueryNoteArgs,
  t.Query["note"]
> = async ({ arguments: { id } }) => {
  try {
    const { Item } = await db.get({ TableName, Key: { id } }).promise();
    return Item as t.Query["note"];
  } catch (e) {
    return undefined;
  }
};
