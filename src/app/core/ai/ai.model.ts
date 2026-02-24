export interface AIRequest {
    prompt: string;
    systemPrompt?: string;
    tool: ToolType;
    mode?: string;
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
    | 'dashboard';

export type AIProvider = 'claude' | 'openai' | 'gemini';

export interface AIProviderConfig {
    provider: AIProvider;
    apiKey: string;
    model: string;
    apiUrl: string;
}

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
    'requirement-summarizer': 'Requirement Summarizer',
    'email-drafter': 'Email Drafter',
    'performance-review': 'Performance Review',
    'dashboard': 'Dashboard',
};
