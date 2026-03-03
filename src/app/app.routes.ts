import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
            },
            // Developer Tools
            {
                path: 'developer-tools/code-assistant',
                loadComponent: () =>
                    import('./features/developer-tools/code-assistant/code-assistant.component').then(
                        (m) => m.CodeAssistantComponent
                    ),
            },
            {
                path: 'developer-tools/commit-generator',
                loadComponent: () =>
                    import('./features/developer-tools/commit-generator/commit-generator.component').then(
                        (m) => m.CommitGeneratorComponent
                    ),
            },
            {
                path: 'developer-tools/test-generator',
                loadComponent: () =>
                    import('./features/developer-tools/test-generator/test-generator.component').then(
                        (m) => m.TestGeneratorComponent
                    ),
            },
            {
                path: 'developer-tools/system-architect',
                loadComponent: () =>
                    import('./features/developer-tools/system-architect/system-architect.component').then(
                        (m) => m.SystemArchitectComponent
                    ),
            },
            // Career Accelerator
            {
                path: 'career-tools/resume-optimizer',
                loadComponent: () =>
                    import('./features/career-tools/resume-optimizer/resume-optimizer.component').then(
                        (m) => m.ResumeOptimizerComponent
                    ),
            },
            {
                path: 'career-tools/linkedin-enhancer',
                loadComponent: () =>
                    import('./features/career-tools/linkedin-enhancer/linkedin-enhancer.component').then(
                        (m) => m.LinkedinEnhancerComponent
                    ),
            },
            {
                path: 'career-tools/job-analyzer',
                loadComponent: () =>
                    import('./features/career-tools/job-analyzer/job-analyzer.component').then(
                        (m) => m.JobAnalyzerComponent
                    ),
            },
            {
                path: 'career-tools/mock-interview',
                loadComponent: () =>
                    import('./features/career-tools/mock-interview/mock-interview.component').then(
                        (m) => m.MockInterviewComponent
                    ),
            },
            {
                path: 'career-tools/career-roadmap',
                loadComponent: () =>
                    import('./features/career-tools/career-roadmap/career-roadmap.component').then(
                        (m) => m.CareerRoadmapComponent
                    ),
            },
            {
                path: 'career-tools/resume-builder',
                loadComponent: () =>
                    import('./features/career-tools/resume-builder/resume-builder.component').then(
                        (m) => m.ResumeBuilderComponent
                    ),
            },
            // Enterprise & Productivity
            {
                path: 'enterprise-tools/meeting-analyzer',
                loadComponent: () =>
                    import('./features/enterprise-tools/meeting-analyzer/meeting-analyzer.component').then(
                        (m) => m.MeetingAnalyzerComponent
                    ),
            },
            {
                path: 'enterprise-tools/requirement-summarizer',
                loadComponent: () =>
                    import(
                        './features/enterprise-tools/requirement-summarizer/requirement-summarizer.component'
                    ).then((m) => m.RequirementSummarizerComponent),
            },
            {
                path: 'enterprise-tools/email-drafter',
                loadComponent: () =>
                    import('./features/enterprise-tools/email-drafter/email-drafter.component').then(
                        (m) => m.EmailDrafterComponent
                    ),
            },
            {
                path: 'enterprise-tools/performance-review',
                loadComponent: () =>
                    import(
                        './features/enterprise-tools/performance-review/performance-review.component'
                    ).then((m) => m.PerformanceReviewComponent),
            },
            {
                path: 'enterprise-tools/swot-analysis',
                loadComponent: () =>
                    import('./features/enterprise-tools/swot-analysis/swot-analysis.component').then(
                        (m) => m.SwotAnalysisComponent
                    ),
            },
            {
                path: 'productivity/study-planner',
                loadComponent: () =>
                    import('./features/productivity/study-planner/study-planner.component').then(
                        (m) => m.StudyPlannerComponent
                    ),
            },
            {
                path: 'productivity/task-breakdown',
                loadComponent: () =>
                    import('./features/productivity/task-breakdown/task-breakdown.component').then(
                        (m) => m.TaskBreakdownComponent
                    ),
            },
            {
                path: 'productivity/budget-planner',
                loadComponent: () =>
                    import('./features/productivity/budget-planner/budget-planner.component').then(
                        (m) => m.BudgetPlannerComponent
                    ),
            },
            // Lifestyle
            {
                path: 'lifestyle/itinerary-generator',
                loadComponent: () =>
                    import('./features/lifestyle/itinerary-generator/itinerary-generator.component').then(
                        (m) => m.ItineraryGeneratorComponent
                    ),
            },
            {
                path: 'lifestyle/healthy-habits',
                loadComponent: () =>
                    import('./features/lifestyle/healthy-habits/healthy-habits.component').then(
                        (m) => m.HealthyHabitsComponent
                    ),
            },
            { path: '**', redirectTo: 'dashboard' },
        ],
    },
];
