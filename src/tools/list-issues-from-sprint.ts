import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.ts";
import { issueSchema } from "../common/schema.ts";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-board/#api-agile-1-0-board-boardid-sprint-sprintid-issue-get

const listIssuesFromSprintSchema = z.object({
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  expand: z.string().optional(),
  total: z.number().optional(),
  issues: z.array(issueSchema),
});

export const listIssuesFromSprintInputSchema = z.object({
  sprintId: z.string().describe("The ID of the sprint"),
  boardId: z.string().describe("The ID of the board"),
  maxResults: z
    .number()
    .optional()
    .describe(
      "The maximum number of results to return, (default: 5, max: 100)",
    ),
  startAt: z
    .number()
    .optional()
    .describe("The starting index of the returned boards"),
  expand: z
    .string()
    .optional()
    .describe(
      "Use this parameter to include additional information in the response. This parameter accepts a comma-separated list. Expand options include: `operations`,`versionedRepresentations`,`editmeta`,`changelog` and `renderedFields`. Comma separated list of options.",
    ),
});

export const LIST_ISSUES_FROM_SPRINT_TOOL: Tool = {
  name: "list_issues_from_sprint",
  description: "List issues from a sprint",
  inputSchema: zodToJsonSchema(
    listIssuesFromSprintInputSchema,
  ) as Tool["inputSchema"],
};

export type ListIssuesFromSprintInput = z.output<
  typeof listIssuesFromSprintInputSchema
>;

export async function listIssuesFromSprint(input: ListIssuesFromSprintInput) {
  const url = new URL(
    `/rest/agile/1.0/board/${input.boardId}/sprint/${input.sprintId}/issue`,
    env.JIRA_BASE_URL,
  );

  if (input.expand) url.searchParams.set("expand", input.expand);
  if (input.startAt) url.searchParams.set("startAt", input.startAt.toString());
  if (input.maxResults)
    url.searchParams.set("maxResults", input.maxResults.toString());

  const json = await $jiraJson(url.toString());

  if (json.isErr()) return err(json.error);

  const result = listIssuesFromSprintSchema.safeParse(json.value);

  if (!result.success) {
    return err(new Error("Invalid response from Jira"));
  }

  return ok(result.data);
}
