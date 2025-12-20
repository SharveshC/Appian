import { AgentConfig, CaseContext, Suggestion } from './models';
import { KnowledgeBase, DocumentFragment } from './knowledgeBase';

export class ContextAwareKnowledgeAgent {
    private config: AgentConfig;
    private kb: KnowledgeBase;
    public name: string;

    constructor(config: AgentConfig) {
        this.config = config;
        this.kb = new KnowledgeBase();
        this.name = config.agent_name;
    }

    /**
     * Proactively suggests knowledge based on the live case context.
     */
    suggestKnowledge(context: CaseContext): Suggestion[] {

        // 1. Query the KB based on Context
        const fragments = this.kb.search({
            case_type: context.case_type,
            sub_type: context.sub_type,
            jurisdiction: context.jurisdiction,
            policy_category: context.policy_category
        });

        // 2. Transform Fragments into Suggestions
        const suggestions: Suggestion[] = fragments.map(frag => {
            return {
                type: frag.type,
                title: frag.title,
                content: frag.content,
                relevance: this.determineRelevance(frag, context),
                citation: {
                    source_document: frag.metadata.source_document,
                    version: frag.metadata.version,
                    location: `ID: ${frag.id}`, // In a real doc, this might be "Page 5, Para 2"
                    link: `appian://docs/${frag.metadata.source_document.replace(/\s/g, '_')}` // Simulated internal link
                }
            };
        });

        // Limit to top K from config
        return suggestions.slice(0, this.config.retrieval_rules.top_k_results);
    }

    private determineRelevance(frag: DocumentFragment, context: CaseContext): string {
        if (context.sub_type && frag.metadata.case_type_tags.includes(context.sub_type)) {
            return `Highly Relevant: Matches '${context.sub_type}'`;
        }
        return `Relevant: Matches '${context.case_type}' within ${frag.metadata.jurisdiction}`;
    }
}
