export interface AIRequest {
    prompt: string;
    systemPrompt?: string;
    tool: ToolType;
    mode?: string;
    model?: string;
    maxTokens?: number;
}

export interface AIResponse {
    content: string;
    tool: ToolType;
    tokens?: number;
    model?: string;
    timestamp: Date;
}

export interface AIError {
    message: string;
    code: string;
    status?: number;
}

export interface PromptHistory {
    id: string;
    tool: ToolType;
    prompt: string;
    response: string;
    timestamp: Date;
    mode?: string;
}

export interface PromptTemplate {
    id: string;
    name: string;
    tool: ToolType;
    prompt: string;
    tags: string[];
}

export interface ToolUsage {
    tool: ToolType;
    count: number;
    lastUsed: Date;
}

export type ToolType =
    | 'code-assistant'
    | 'commit-generator'
    | 'test-generator'
    | 'meeting-analyzer'
    | 'requirement-summarizer'
    | 'email-drafter'
    | 'performance-review'
    | 'resume-optimizer'
    | 'linkedin-enhancer'
    | 'job-analyzer'
    | 'mock-interview'
    | 'career-roadmap'
    | 'itinerary-generator'
    | 'study-planner'
    | 'task-breakdown'
    | 'system-architect'
    | 'swot-analysis'
    | 'healthy-habits'
    | 'budget-planner'
    | 'dashboard';

export type ChannelType = 'all' | 'developer' | 'career' | 'enterprise' | 'productivity' | 'lifestyle';

export const TOOL_CHANNELS: Record<ToolType, ChannelType> = {
    'code-assistant': 'developer',
    'commit-generator': 'developer',
    'test-generator': 'developer',
    'system-architect': 'developer',
    'resume-optimizer': 'career',
    'linkedin-enhancer': 'career',
    'job-analyzer': 'career',
    'mock-interview': 'career',
    'career-roadmap': 'career',
    'meeting-analyzer': 'enterprise',
    'requirement-summarizer': 'enterprise',
    'email-drafter': 'enterprise',
    'performance-review': 'enterprise',
    'swot-analysis': 'enterprise',
    'study-planner': 'productivity',
    'task-breakdown': 'productivity',
    'budget-planner': 'productivity',
    'itinerary-generator': 'lifestyle',
    'healthy-habits': 'lifestyle',
    'dashboard': 'all',
};

export type AIProvider = 'claude' | 'openai' | 'gemini' | 'openrouter';

export interface AIProviderConfig {
    provider: AIProvider;
    apiKey: string;
    model: string;
    apiUrl: string;
}

export const MODELS = {
    PRIMARY: 'meta-llama/llama-3-70b-instruct',
    BUDGET: 'meta-llama/llama-3-8b-instruct',
    POLISH: 'anthropic/claude-3-haiku',
};

export interface AppPreferences {
    theme: 'dark' | 'light';
    sidebarCollapsed: boolean;
    lastActiveTool: ToolType;
}

export const TOOL_LABELS: Record<ToolType, string> = {
    'code-assistant': 'Code Assistant',
    'commit-generator': 'Commit Generator',
    'test-generator': 'Test Generator',
    'meeting-analyzer': 'Meeting Analyzer',
    'requirement-summarizer': 'Req. Summarizer',
    'email-drafter': 'Email Drafter',
    'performance-review': 'Perf. Review',
    'resume-optimizer': 'Resume Optimizer',
    'linkedin-enhancer': 'LinkedIn Enhancer',
    'job-analyzer': 'Job Analyzer',
    'mock-interview': 'Mock Interview',
    'career-roadmap': 'Career Roadmap',
    'itinerary-generator': 'Travel Itinerary',
    'study-planner': 'Study Planner',
    'task-breakdown': 'Task Breakdown',
    'system-architect': 'System Architect',
    'swot-analysis': 'SWOT Analysis',
    'healthy-habits': 'Health Coach',
    'budget-planner': 'Budget Planner',
    'dashboard': 'Dashboard',
};
