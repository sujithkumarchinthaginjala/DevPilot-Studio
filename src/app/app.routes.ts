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
            { path: '**', redirectTo: 'dashboard' },
        ],
    },
];
