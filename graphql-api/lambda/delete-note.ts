import { AppSyncResolverHandler } from "aws-lambda";
import * as t from "../generated-types";
import { TableName, db } from "./common";

export const handler: AppSyncResolverHandler<
  t.MutationDeleteNoteArgs,
  t.Mutation["deleteNote"]
> = async ({ arguments: { id } }) => {
  try {
    await db
      .delete({
        TableName,
        Key: { id },
      })
      .promise();
    return id;
  } catch (e) {
    return undefined;
  }
};
