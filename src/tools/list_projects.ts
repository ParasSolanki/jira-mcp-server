import { z } from "zod";
import { $jiraJson } from "../utils/jira-fetch.ts";
import { err, ok } from "neverthrow";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { env } from "../env.js";

// @see https://developer.atlassian.com/server/jira/platform/rest/v10004/api-group-projects/#api-api-2-projects-picker-get

export const listProjectsInputSchema = z.object({
  maxResults: z
    .number()
    .optional()
    .describe("The maximum number of results to return, (max: 100)"),
  query: z
    .string()
    .optional()
    .describe(
      "A query string used to filter the returned projects. The query string cannot be used with the startAt and maxResults parameters.",
    ),
  expand: z
    .string()
    .optional()
    .describe(
      "Use this parameter to include additional information in the response. This parameter accepts a comma-separated list. Expand options include: `description`, `lead`, `issueTypes`, `url`, `projectKeys`, `permissions`, `insight`. Comma separated list of options.",
    ),
});

export const LIST_PROJECTS_TOOL: Tool = {
  name: "list_projects",
  description: "List projects from Jira",
  inputSchema: zodToJsonSchema(listProjectsInputSchema) as Tool["inputSchema"],
};

export type ListProjectsInput = z.output<typeof listProjectsInputSchema>;

export async function listProjects(input: ListProjectsInput) {
  const url = new URL(`/rest/api/2/project`, env.JIRA_BASE_URL);

  if (input.maxResults)
    url.searchParams.set("maxResults", input.maxResults.toString());

  if (input.query) url.searchParams.set("query", input.query);

  if (input.expand) url.searchParams.set("expand", input.expand);

  const json = await $jiraJson(url.toString());

  if (json.isErr()) return err(json.error);

  return ok(json.value);
}
