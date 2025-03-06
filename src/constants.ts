import { getUserAgent } from "universal-user-agent";

export const VERSION = "0.0.1";
export const USER_AGENT = `modelcontextprotocol/servers/jira/v${VERSION} ${getUserAgent()}`;
