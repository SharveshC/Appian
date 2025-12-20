export interface DocumentFragment {
    id: string; // concise ID, e.g. "POL-AUTO-01.2"
    type: "Policy Clause" | "SOP Step" | "Regulatory Rule";
    title: string;
    content: string;
    metadata: {
        source_document: string;
        version: string;
        jurisdiction: string; // e.g., "California", "Federal"
        case_type_tags: string[]; // e.g., ["Insurance Claim", "Auto Accident"]
        effective_date: string;
    };
}

export class KnowledgeBase {
    private fragments: DocumentFragment[];

    constructor() {
        // Simulated database with "Fragmented" knowledge chunks
        this.fragments = [
            {
                id: "POL-AUTO-CLAIM-05.1",
                type: "Policy Clause",
                title: "Determining Liability in Multi-Vehicle Accidents",
                content: "In accidents involving three or more vehicles, the rear-most vehicle is presumed at fault unless proven otherwise by dashcam footage or police report.",
                metadata: {
                    source_document: "Auto Claims Adjudication Policy",
                    version: "4.2",
                    jurisdiction: "California",
                    case_type_tags: ["Insurance Claim", "Auto Accident"],
                    effective_date: "2023-01-15"
                }
            },
            {
                id: "SOP-BENEFIT-REV-02",
                type: "SOP Step",
                title: "Income Verification for SNAP Benefits",
                content: "Agent must verify applicant's income using the last 30 days of paystubs. If paystubs are unavailable, a letter from the employer is acceptable.",
                metadata: {
                    source_document: "SNAP Processing Standard Operating Procedure",
                    version: "1.0",
                    jurisdiction: "Federal",
                    case_type_tags: ["Government Benefit", "SNAP"],
                    effective_date: "2022-11-01"
                }
            },
            {
                id: "REG-HIPAA-SEC-1",
                type: "Regulatory Rule",
                title: "PHI Disclosure Limits",
                content: "Protected Health Information (PHI) can only be disclosed to the claimant or their authorized legal representative. Verification of identity is mandatory before release.",
                metadata: {
                    source_document: "HIPAA Compliance Guide for Insurers",
                    version: "2023",
                    jurisdiction: "Federal",
                    case_type_tags: ["Insurance Claim", "Medical"],
                    effective_date: "2023-01-01"
                }
            },
            {
                id: "POL-LIFE-PAY-09",
                type: "Policy Clause",
                title: "Beneficiary Payout Timeline",
                content: "Approved life insurance claims must be paid out within 30 days of final approval. Interest accrues at 3% per annum after this period.",
                metadata: {
                    source_document: "Life Insurance Settlement Policy",
                    version: "3.1",
                    jurisdiction: "New York",
                    case_type_tags: ["Insurance Claim", "Life Insurance"],
                    effective_date: "2021-05-20"
                }
            }
        ];
    }

    /**
     * Searches for relevant knowledge fragments based on key case context.
     * This simulates the "Push" mechanism by finding highly relevant matches.
     */
    search(context: { case_type: string, sub_type?: string, jurisdiction: string, policy_category?: string }): DocumentFragment[] {

        const results = this.fragments.filter(frag => {
            // 1. Jurisdiction Match (Strict or Federal/Global)
            const jurisdictionMatch =
                frag.metadata.jurisdiction === context.jurisdiction ||
                frag.metadata.jurisdiction === "Federal" ||
                frag.metadata.jurisdiction === "Global";

            if (!jurisdictionMatch) return false;

            // 2. Case Type Tag Match
            // Check if the fragment's tags overlap with the case_type or sub_type
            const tags = frag.metadata.case_type_tags;
            const typeMatch = tags.includes(context.case_type);
            const subTypeMatch = context.sub_type ? tags.includes(context.sub_type) : false;

            // We consider it a match if it matches the broad case type. 
            // In a real system, we'd rank "subTypeMatch" higher.
            return typeMatch || subTypeMatch;
        });

        return results;
    }
}
