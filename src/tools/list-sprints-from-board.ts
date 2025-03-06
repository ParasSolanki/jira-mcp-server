import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.js";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-board/#api-agile-1-0-board-boardid-sprint-get

export const listSprintsFromBoardInputSchema = z.object({
  boardId: z.string().describe("The ID of the board"),
  maxResults: z
    .number()
    .optional()
    .describe("The maximum number of results to return, (max: 100)"),
  startAt: z
    .number()
    .optional()
    .describe("The starting index of the returned boards"),
});

export const LIST_SPRINTS_FROM_BOARD_TOOL: Tool = {
  name: "list_sprints_from_board",
  description: "List sprints from a board",
  inputSchema: zodToJsonSchema(
    listSprintsFromBoardInputSchema,
  ) as Tool["inputSchema"],
};

export type ListSprintsFromBoardInput = z.output<
  typeof listSprintsFromBoardInputSchema
>;

export async function listSprintsFromBoard(input: ListSprintsFromBoardInput) {
  const url = new URL(
    `/rest/agile/1.0/board/${input.boardId}/sprint`,
    env.JIRA_BASE_URL,
  );

  if (input.startAt) url.searchParams.set("startAt", input.startAt.toString());

  if (input.maxResults)
    url.searchParams.set("maxResults", input.maxResults.toString());

  const json = await $jiraJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
