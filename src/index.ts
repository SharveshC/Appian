import { ContextAwareKnowledgeAgent } from './agent';
import { AgentConfig, CaseContext } from './models';

function main() {
    // 1. Agent Configuration
    const agentConfig: AgentConfig = {
        agent_name: "AppianKnowledgeAssistant",
        role: "Proactively suggest relevant policy and SOPs for active cases.",
        constraints: {
            allowed_sources: ["Policy Database", "SOP Repository", "Regulatory Feed"],
            disallowed_actions: ["Internet Search", "Uncited Advice"]
        },
        retrieval_rules: {
            search_method: "Context-Tag-Match",
            top_k_results: 3
        },
        response_rules: {
            citation_required: true
        }
    };

    const agent = new ContextAwareKnowledgeAgent(agentConfig);

    // 2. Simulate Case 1: Auto Accident in California
    const caseContext1: CaseContext = {
        case_id: "CASE-2024-001",
        case_type: "Insurance Claim",
        sub_type: "Auto Accident",
        jurisdiction: "California",
        status: "Investigation",
        description: "Three-car pileup on I-5. Customer was the middle car."
    };

    console.log(`\n>>> [Event] Agent opened Case ${caseContext1.case_id} (${caseContext1.sub_type})`);
    const suggestions1 = agent.suggestKnowledge(caseContext1);
    console.log("--- Just-in-Time Knowledge Suggestions ---");
    console.log(JSON.stringify(suggestions1, null, 2));


    // 3. Simulate Case 2: SNAP Benefit Application (Federal/Unspecified State)
    const caseContext2: CaseContext = {
        case_id: "CASE-2024-002",
        case_type: "Government Benefit",
        sub_type: "SNAP",
        jurisdiction: "Federal",
        status: "Review",
        description: "Applicant provided partial income documentation."
    };

    console.log(`\n>>> [Event] Agent opened Case ${caseContext2.case_id} (${caseContext2.sub_type})`);
    const suggestions2 = agent.suggestKnowledge(caseContext2);
    console.log("--- Just-in-Time Knowledge Suggestions ---");
    console.log(JSON.stringify(suggestions2, null, 2));
}

main();
