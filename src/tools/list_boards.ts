import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.js";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-board/#api-agile-1-0-board-get

export const listBoardsInputSchema = z.object({
  projectKeyOrId: z.string().describe("The key or ID of the project"),
  name: z
    .string()
    .optional()
    .describe(
      "The name of the boards to return, Must be less than 255 characters.",
    ),
  maxResults: z
    .number()
    .optional()
    .describe("The maximum number of results to return, (max: 100)"),
  startAt: z
    .number()
    .optional()
    .describe("The starting index of the returned boards"),
  type: z
    .enum(["scrum", "kanban"])
    .optional()
    .describe("The type of boards to return"),
});

export const LIST_BOARDS_TOOL: Tool = {
  name: "list_boards",
  description: "List boards from a project",
  inputSchema: zodToJsonSchema(listBoardsInputSchema) as Tool["inputSchema"],
};

export type ListBoardsInput = z.output<typeof listBoardsInputSchema>;

export async function listBoards(input: ListBoardsInput) {
  const url = new URL(`/rest/agile/1.0/board`, env.JIRA_BASE_URL);

  url.searchParams.set("projectKeyOrId", input.projectKeyOrId);

  if (input.name) url.searchParams.set("name", input.name);

  if (input.type) url.searchParams.set("type", input.type);

  if (input.startAt) url.searchParams.set("startAt", input.startAt.toString());

  if (input.maxResults)
    url.searchParams.set("maxResults", input.maxResults.toString());

  const json = await $jiraJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
