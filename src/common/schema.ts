import { z } from "zod";

export const issueSchema = z.object({
  id: z.string(),
  key: z.string(),
  self: z.string(),
  fields: z.object({
    created: z.string(),
    description: z.string().nullable().optional(),
    statuscategorychangedate: z.string().nullable().optional(),
    status: z
      .object({
        id: z.string(),
        self: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    sprint: z
      .object({
        id: z.string(),
        self: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
        originBoardId: z.string().nullable().optional(),
        state: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    project: z
      .object({
        id: z.string(),
        self: z.string(),
        name: z.string(),
        key: z.string(),
        description: z.string().nullable().optional(),
        originBoardId: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    parent: z
      .object({
        id: z.string(),
        self: z.string(),
        name: z.string(),
        key: z.string(),
        description: z.string().nullable().optional(),
        originBoardId: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    priority: z
      .object({
        id: z.string(),
        self: z.string(),
        name: z.string(),
        description: z.string().nullable().optional(),
        originBoardId: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    assignee: z
      .object({
        self: z.string(),
        displayName: z.string(),
      })
      .nullable()
      .optional(),
    creator: z
      .object({
        self: z.string(),
        displayName: z.string(),
      })
      .nullable()
      .optional(),
    reporter: z
      .object({
        self: z.string(),
        displayName: z.string(),
      })
      .nullable()
      .optional(),
    issuetype: z
      .object({
        name: z.string(),
        self: z.string(),
        description: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  }),
});

export type Issue = z.infer<typeof issueSchema>;
