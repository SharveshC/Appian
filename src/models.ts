import { z } from 'zod';

export const CaseContextSchema = z.object({
    case_id: z.string(),
    case_type: z.string(), // e.g., "Insurance Claim", "Government Benefit"
    sub_type: z.string().optional(), // e.g., "Auto Accident", "Unemployment"
    jurisdiction: z.string(), // e.g., "California", "EU", "Federal"
    status: z.string().optional(), // e.g., "Review", "Approval"
    policy_category: z.string().optional(),
    description: z.string().optional(), // Brief description of the current situation in the case
});

export const ConstraintsSchema = z.object({
    allowed_sources: z.array(z.string()),
    disallowed_actions: z.array(z.string()),
});

export const RetrievalRulesSchema = z.object({
    search_method: z.string(),
    top_k_results: z.number(),
});

export const ResponseRulesSchema = z.object({
    citation_required: z.boolean(),
});

export const CitationSchema = z.object({
    source_document: z.string(),
    version: z.string(),
    location: z.string(), // Page, Paragraph, or Clause ID
    link: z.string().optional(),
});

export const SuggestionSchema = z.object({
    type: z.enum(["Policy Clause", "SOP Step", "Regulatory Rule"]),
    title: z.string(),
    content: z.string(), // The actual guidance text
    relevance: z.string(), // Why this was shown (e.g., "Matched Case Type: Insurance")
    citation: CitationSchema,
});

export const AgentConfigSchema = z.object({
    agent_name: z.string(),
    role: z.string(),
    constraints: ConstraintsSchema,
    retrieval_rules: RetrievalRulesSchema,
    response_rules: ResponseRulesSchema,
});

export type CaseContext = z.infer<typeof CaseContextSchema>;
export type Suggestion = z.infer<typeof SuggestionSchema>;
export type AgentConfig = z.infer<typeof AgentConfigSchema>;
