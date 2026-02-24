import { ToolType } from './ai.model';

export interface PromptConfig {
    systemPrompt: string;
    userPrompt: string;
}

export function buildCodeAssistantPrompt(code: string, mode: string): PromptConfig {
    const modeMap: Record<string, string> = {
        explain: 'Explain the following code clearly and concisely. Break down what each part does, mention patterns used, and highlight any potential issues.',
        refactor: 'Refactor the following code to improve readability, maintainability, and performance. Apply clean code principles and modern best practices. Show the improved version with brief explanations.',
        improve: 'Improve the following code by fixing bugs, improving performance, adding error handling, and applying best practices. Explain each improvement you made.',
    };

    return {
        systemPrompt: `You are an expert software engineer and code reviewer. You provide concise, accurate, and insightful code analysis. Format your response with clear sections using markdown headers. Use code blocks for any code samples. Be professional yet approachable.`,
        userPrompt: `${modeMap[mode] || modeMap['explain']}\n\n\`\`\`\n${code}\n\`\`\``,
    };
}

export function buildCommitPrompt(changes: string): PromptConfig {
    return {
        systemPrompt: `You are an expert developer who writes clean, meaningful Git commit messages following the Conventional Commits specification (feat, fix, docs, style, refactor, test, chore). Keep messages concise and descriptive. Format: provide 3 commit message options ranked by appropriateness.`,
        userPrompt: `Generate professional Git commit messages for these code changes:\n\n${changes}\n\nProvide 3 options, ranked best to good. Format each as:\n**Option 1 (Best):** \`message here\`\nBrief explanation of why this is the best choice.\n\n**Option 2:** \`message here\`\n**Option 3:** \`message here\``,
    };
}

export function buildTestCasePrompt(code: string): PromptConfig {
    return {
        systemPrompt: `You are a senior software engineer specializing in test-driven development. You write comprehensive unit tests using modern testing frameworks. Generate tests that cover happy paths, edge cases, and error scenarios. Use descriptive test names and arrange-act-assert pattern.`,
        userPrompt: `Generate comprehensive unit tests for the following code. Include:\n- Happy path tests\n- Edge case tests\n- Error handling tests\n- Mock setup if needed\n\nCode to test:\n\`\`\`\n${code}\n\`\`\`\n\nUse the most appropriate testing framework (Jest/Vitest/Jasmine based on context). Output the complete test file.`,
    };
}

export function buildMeetingAnalyzerPrompt(notes: string): PromptConfig {
    return {
        systemPrompt: `You are an expert business analyst and meeting facilitator. You excel at extracting structured insights from unstructured meeting notes. Be concise, actionable, and organized.`,
        userPrompt: `Analyze these meeting notes and provide a structured summary:\n\n${notes}\n\nProvide:\n## 📋 Meeting Summary\nBrief 2-3 sentence overview.\n\n## ✅ Key Decisions\nBulleted list of decisions made.\n\n## 🎯 Action Items\nTable with: Task | Owner | Deadline\n\n## 💡 Key Discussion Points\nMain topics discussed.\n\n## ⚠️ Blockers & Risks\nAny mentioned blockers or risks.`,
    };
}

export function buildRequirementSummarizerPrompt(requirements: string): PromptConfig {
    return {
        systemPrompt: `You are a senior product manager and business analyst. You distill complex requirements into clear, structured summaries that both technical and non-technical stakeholders can understand.`,
        userPrompt: `Analyze and summarize these requirements:\n\n${requirements}\n\nProvide:\n## 🎯 Core Objective\nWhat this feature/project needs to achieve.\n\n## 📌 Functional Requirements\nNumbered list of what the system must do.\n\n## 🔧 Technical Considerations\nKey technical aspects and constraints.\n\n## 🚫 Out of Scope\nWhat is explicitly excluded.\n\n## 📊 Acceptance Criteria\nHow success will be measured.\n\n## ⚡ Priority & Complexity\nEstimated priority (High/Medium/Low) and complexity (High/Medium/Low).`,
    };
}

export function buildEmailDrafterPrompt(context: string, tone: string, purpose: string): PromptConfig {
    const toneMap: Record<string, string> = {
        professional: 'formal, polished, and business-appropriate',
        friendly: 'warm, approachable, yet professional',
        assertive: 'direct, confident, and action-oriented',
        empathetic: 'understanding, supportive, and considerate',
    };

    return {
        systemPrompt: `You are a professional communication expert who crafts exceptional business emails. You balance clarity, professionalism, and impact. Always include a clear subject line, proper greeting, well-structured body, and appropriate closing.`,
        userPrompt: `Draft a professional email with a ${toneMap[tone] || toneMap['professional']} tone.\n\nPurpose: ${purpose}\nContext: ${context}\n\nFormat:\n**Subject:** [subject line]\n\nDear [Name],\n\n[Email body]\n\nBest regards,\n[Your Name]`,
    };
}

export function buildPerformanceReviewPrompt(context: string): PromptConfig {
    return {
        systemPrompt: `You are an expert HR professional and leadership coach who specializes in constructive, balanced performance reviews. You highlight strengths, provide actionable feedback, and set clear growth paths. Use specific, evidence-based language.`,
        userPrompt: `Generate a professional performance review based on this context:\n\n${context}\n\nStructure the review as:\n## 🌟 Overall Performance Summary\nBalanced 2-3 sentence overview.\n\n## 💪 Key Strengths\nSpecific accomplishments and positive behaviors.\n\n## 📈 Areas for Growth\nConstructive areas for improvement with specific suggestions.\n\n## 🎯 Goal Achievement\nAssessment of goals met vs. missed.\n\n## 🚀 Development Plan\nActionable next steps and learning opportunities.\n\n## 📊 Rating\nOverall performance rating: Exceptional / Exceeds Expectations / Meets Expectations / Needs Improvement`,
    };
}

export function getSystemPromptForTool(tool: ToolType): string {
    const prompts: Record<ToolType, string> = {
        'code-assistant': 'You are an expert software engineer.',
        'commit-generator': 'You are an expert at writing git commit messages.',
        'test-generator': 'You are an expert at writing unit tests.',
        'meeting-analyzer': 'You are an expert business analyst.',
        'requirement-summarizer': 'You are an expert product manager.',
        'email-drafter': 'You are a professional communication expert.',
        'performance-review': 'You are an expert HR professional.',
        'dashboard': 'You are a helpful AI assistant.',
    };
    return prompts[tool];
}
