import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { AppStore } from '../../stores/app.store';
import { ToolType } from '../../core/ai/ai.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ToolCardComponent, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    store = inject(AppStore);

    devTools: { icon: string; title: string; description: string; link: string; badge?: string; badgeClass?: string; gradient: string }[] = [
        {
            icon: 'bi-code-slash',
            title: 'Code Assistant',
            description: 'Explain, refactor, and improve your code with AI guidance.',
            link: '/developer-tools/code-assistant',
            badge: 'Popular',
            badgeClass: 'badge-cyan',
            gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        },
        {
            icon: 'bi-git',
            title: 'Commit Generator',
            description: 'Generate meaningful commit messages following conventional specs.',
            link: '/developer-tools/commit-generator',
            gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        },
        {
            icon: 'bi-funnel',
            title: 'Test Generator',
            description: 'Create comprehensive unit tests for your functions automatically.',
            link: '/developer-tools/test-generator',
            gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        },
    ];

    enterpriseTools: { icon: string; title: string; description: string; link: string; badge?: string; badgeClass?: string; gradient: string }[] = [
        {
            icon: 'bi-people',
            title: 'Meeting Analyzer',
            description: 'Convert messy notes into structured summaries and action items.',
            link: '/enterprise-tools/meeting-analyzer',
            badge: 'New',
            badgeClass: 'badge-success',
            gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
        },
        {
            icon: 'bi-envelope',
            title: 'Email Drafter',
            description: 'Draft professional emails for any context with the perfect tone.',
            link: '/enterprise-tools/email-drafter',
            gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        },
        {
            icon: 'bi-file-earmark-text',
            title: 'Requirement Summarizer',
            description: 'Distill complex requirements into clear project objectives.',
            link: '/enterprise-tools/requirement-summarizer',
            gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)',
        },
    ];

    ngOnInit() {
        this.store.setActiveTool('dashboard');
    }
}
