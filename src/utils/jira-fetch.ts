import { USER_AGENT } from "../constants.ts";
import { env } from "../env.ts";
import { err, ok } from "neverthrow";

export async function $jira(url: string, options?: RequestInit) {
  const defaultHeaders = {
    Authorization: `Basic ${Buffer.from(env.JIRA_PERSONAL_ACCESS_TOKEN).toString("base64")}`,
    Accept: "application/json",
    "User-Agent": USER_AGENT,
  };

  const headers = Object.assign(defaultHeaders, options?.headers ?? {});

  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      return err(new Error(`Failed to fetch ${url}: ${response.statusText}`));
    }

    return ok(response);
  } catch (error) {
    return err(new Error(`Failed to fetch ${url}: ${error}`));
  }
}

export async function $jiraJson(url: string, options?: RequestInit) {
  try {
    const response = await $jira(url, options);

    if (response.isErr()) return err(response.error);

    const json = await response.value.json();

    return ok(json);
  } catch (error) {
    return err(new Error(`Failed to fetch ${url}: ${error}`));
  }
}
