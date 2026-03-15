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


/** ── Career OS New Prompts ── **/

export function buildResumeOptimizerPrompt(resumeContent: string, jobDescription?: string): PromptConfig {
    return {
        systemPrompt: `You are a top-tier Career Coach and ATS (Applicant Tracking System) expert. You help professionals optimize their resumes to stand out to recruiters and pass automated filters. You focus on quantifiable achievements, strong action verbs, and relevancy.`,
        userPrompt: `Optimize this resume content. ${jobDescription ? 'Tailor it specifically for this Job Description: \n' + jobDescription : 'Improve it for general high-impact professional standards.'}\n\nResume Content:\n${resumeContent}\n\nProvide:\n## 🚀 Executive Summary / Headline\nHigh-impact 2-sentence summary.\n\n## ✨ Optimized Experience Bullets\nRewrite the key experience points. Use the STAR method (Situation, Task, Action, Result) and include quantifiable metrics where possible.\n\n## 🔑 Skills Enhancement\nSuggest missing keywords or high-value skills to highlight.\n\n## 💡 General Advice\nFormatting or structural tips specific to this profile.`,
    };
}

export function buildLinkedInEnhancerPrompt(aboutContent: string, experienceContent: string): PromptConfig {
    return {
        systemPrompt: `You are a LinkedIn personal branding expert. You help professionals build a compelling online presence that attracts recruiters and networking opportunities. You focus on tone, keyword optimization, and narrative flow.`,
        userPrompt: `Enhance this LinkedIn profile content:\n\n**Current "About" Section:**\n${aboutContent}\n\n**Experience Details:**\n${experienceContent}\n\nProvide:\n## ✍️ Optimized Headline\n3 high-impact versions (Personal brand focused, Role-focused, Hybrid).\n\n## 📖 New "About" Section\nA compelling narrative that highlights impact, values, and expert areas.\n\n## 🛠️ Experience Optimization\nSpecific suggestions to make experience descriptions more engaging for a LinkedIn audience.\n\n## 🎯 Engagement Tips\nHow to optimize the profile for LinkedIn search and networking.`,
    };
}

export function buildJobAnalyzerPrompt(jobDescription: string, userProfile: string): PromptConfig {
    return {
        systemPrompt: `You are a career strategist. You excel at deconstructing job postings to find hidden requirements and matching them against candidate profiles to identify gaps and opportunities.`,
        userPrompt: `Analyze this Job Description against the User's Profile:\n\n**Job Description:**\n${jobDescription}\n\n**User Profile / Skills:**\n${userProfile}\n\nProvide:\n## 📊 Match Score\nA percentage match based on skills and experience.\n\n## ✅ Top Skills Found\nKey skills extracted from the JD.\n\n## 🚫 Skill Gaps\nCritical skills/experience the user is currently missing for this role.\n\n## 🗺️ Learning Roadmap\nA structured, step-by-step plan to bridge the identified gaps.\n\n## 💡 Interview Strategy\nKey themes the user should focus on during an interview for this specific role.`,
    };
}


export function buildCareerRoadmapPrompt(goal: string, currentLevel: string): PromptConfig {
    return {
        systemPrompt: `You are a professional mentor and skill strategist. You help individuals design long-term learning and career growth paths that are realistic, structured, and high-impact.`,
        userPrompt: `Create a comprehensive career roadmap for someone aiming to become a **${goal}**, starting from **${currentLevel}** level.\n\nProvide:\n## 📅 3-Month Sprint (Fundamentals)\nCore skills and initial projects.\n\n## 📅 6-Month Milestone (Intermediate)\nAdvanced topics, certifications, and networking.\n\n## 📅 1-Year Goal (Professional)\nSpecializations, personal brand, and job readiness.\n\n## 📚 Recommended Resources\nKey platforms, books, or documentation sites.\n\n## 🛠️ Project Ideas\n3 high-value portfolio projects to build along the way.`,
    };
}

export function buildStudyPlannerPrompt(subject: string, durationWeeks: number, dailyHours: number): PromptConfig {
    return {
        systemPrompt: `You are a learning optimization expert. You create high-efficiency study plans that maximize retention and cover all necessary topics for exams or interviews.`,
        userPrompt: `Create a study planner for **${subject}** for a duration of **${durationWeeks} weeks**, with **${dailyHours} hours** available per day.\n\nProvide:\n## 📅 Weekly Breakdown\nHigh-level goal for each week.\n\n## 🕒 Daily Routine Template\nHow to segment the daily study hours (Theory, Practice, Revision).\n\n## 🎯 Key Topics to Cover\nA checklist of critical concepts.\n\n## 📝 Practice Strategy\nSpecific ways to test knowledge (e.g., LeetCode, flashcards, mock tests).`,
    };
}

export function buildTaskBreakdownPrompt(goal: string): PromptConfig {
    return {
        systemPrompt: `You are an expert Project Manager and Agile Coach. You excel at taking large, vague goals and breaking them down into small, actionable, sprint-style micro-tasks.`,
        userPrompt: `Break down the following goal into a sprint-style task list:\n\n**Goal:** ${goal}\n\nProvide:\n## 🏁 Sprint Objective\nWhat the focus of this breakdown is.\n\n## 📝 Actionable Task List\nA numbered list of micro-tasks (maximum 4 hours per task).\n\n## ⚠️ Potential Blockers\nWhat might slow down progress.\n\n## 📊 Definition of Done\nHow to know when this goal is fully completed.`,
    };
}

export function buildItineraryGeneratorPrompt(destination: string, days: number, budget: string, interests: string): PromptConfig {
    return {
        systemPrompt: `You are a world-class Travel Planner and local expert. You create highly optimized, engaging, and practical travel itineraries that balance exploration, relaxation, and local culture.`,
        userPrompt: `Generate a ${days}-day travel itinerary for **${destination}** with a **${budget}** budget and interests in **${interests}**.\n\nProvide:\n## 🗺️ Trip Overview\nQuick vibe check and what to expect.\n\n## 📅 Day-by-Day Plan\nSegmented by morning, afternoon, and evening for each day.\n\n## 💰 Budget Breakdown\nEstimated daily costs (Food, Transport, Entry fees).\n\n## 💡 Essential Travel Tips\nLocal etiquette, transport hacks, and "must-haves".\n\n## 🛡️ Safety & Packing Note\nsafety considerations and localized packing items.`,
    };
}


export function buildSystemArchitectPrompt(goal: string, requirements: string): PromptConfig {
    return {
        systemPrompt: `You are a senior system architect and database designer. You provide high-level architectural designs, database schemas (SQL/NoSQL), and pattern recommendations that are scalable, secure, and maintainable.`,
        userPrompt: `Design a system architecture based on these requirements:\n\n**Goal:** ${goal}\n**Requirements:** ${requirements}\n\nProvide:\n## 🏗️ Architectural Overview\nHigh-level diagrammatic description and choice of architecture (Microservices, Monolith, etc.).\n\n## 🗄️ Database Schema\nTables/Collections design with key relationships.\n\n## 🛠️ Technology Stack Suggestions\nRecommended frontend, backend, and infrastructure components.\n\n## 🔒 Security & Scalability\nKey considerations for future growth and security.`,
    };
}


export function buildBudgetPlannerPrompt(income: number, expenses: string, financialGoal: string): PromptConfig {
    return {
        systemPrompt: `You are a financial planning expert. You help individuals maximize their savings, manage debt, and reach their financial goals through structured, realistic budgeting.`,
        userPrompt: `Create a monthly budget plan based on:\n\n**Monthly Income:** ${income}\n**Current Expenses:** ${expenses}\n**Financial Goal:** ${financialGoal}\n\nProvide:\n## 📊 Recommended Budget Allocation\nBreakdown using the 50/30/20 rule or better.\n\n## 💰 Saving & Debt Strategy\nSpecific actions to reach the goal faster.\n\n## 📉 Expense Optimization\nAreas where spending can be reduced.\n\n## 🚀 Long-term Financial Path\nEstimates on when the goal will be achieved.`,
    };
}


export function getSystemPromptForTool(tool: ToolType): string {
    const prompts: Record<ToolType, string> = {
        'code-assistant': 'You are an expert software engineer.',
        'test-generator': 'You are an expert at writing unit tests.',
        'meeting-analyzer': 'You are an expert business analyst.',
        'email-drafter': 'You are a professional communication expert.',
        'resume-optimizer': 'You are a career coach and ATS expert.',
        'linkedin-enhancer': 'You are a personal branding expert.',
        'job-analyzer': 'You are a career strategist.',
        'career-roadmap': 'You are a professional mentor.',
        'itinerary-generator': 'You are a world-class travel planner.',
        'study-planner': 'You are a learning optimization expert.',
        'task-breakdown': 'You are an expert project manager.',
        'system-architect': 'You are a senior system architect and database designer.',
        'budget-planner': 'You are an expert financial advisor. Provide structured budget breakdowns, saving tips, and investment advice based on the user\'s financial data.',
        'dashboard': 'You are a helpful AI assistant.',
    };
    return prompts[tool] || 'You are ProPilot AI, a helpful and intelligent productivity assistant.';
}
