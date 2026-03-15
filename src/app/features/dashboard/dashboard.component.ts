import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { AppStore } from '../../stores/app.store';

interface ToolDef {
    icon: string;
    title: string;
    description: string;
    link: string;
    badge?: string;
    badgeClass?: string;
    gradient: string;
}

interface ToolGroup {
    title: string;
    tools: ToolDef[];
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ToolCardComponent, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    store = inject(AppStore);

    toolGroups: ToolGroup[] = [
        {
            title: 'Career Accelerator',
            tools: [
                {
                    icon: 'bi-file-earmark-person',
                    title: 'Resume Optimizer',
                    description: 'AI-driven ATS optimization for maximum hireability.',
                    link: '/career-tools/resume-optimizer',
                    badge: 'Popular',
                    badgeClass: 'badge-cyan',
                    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
                },
                {
                    icon: 'bi-linkedin',
                    title: 'LinkedIn Enhancer',
                    description: 'Professional branding and profile optimization.',
                    link: '/career-tools/linkedin-enhancer',
                    badge: 'New',
                    gradient: 'linear-gradient(135deg, #0077b5, #00a0dc)',
                },

                {
                    icon: 'bi-search',
                    title: 'Job Analyzer',
                    description: 'Deconstruct job postings and strategize your application.',
                    link: '/career-tools/job-analyzer',
                    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
                },
                {
                    icon: 'bi-map',
                    title: 'Career Roadmap',
                    description: 'Strategic path to your next major role.',
                    link: '/career-tools/career-roadmap',
                    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                }
            ]
        },
        {
            title: 'Developer Intelligence',
            tools: [
                {
                    icon: 'bi-code-slash',
                    title: 'Code Assistant',
                    description: 'Explain, refactor, and improve code with AI.',
                    link: '/developer-tools/code-assistant',
                    badge: 'AI',
                    gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                },
                {
                    icon: 'bi-funnel',
                    title: 'Test Generator',
                    description: 'Instantly generate comprehensive unit tests.',
                    link: '/developer-tools/test-generator',
                    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                },
                {
                    icon: 'bi-diagram-3',
                    title: 'System Architect',
                    description: 'Design robust, scalable system architectures.',
                    link: '/developer-tools/system-architect',
                    badge: 'New',
                    gradient: 'linear-gradient(135deg, #0ea5e9, #10b981)',
                }
            ]
        },
        {
            title: 'Productivity Labs',
            tools: [
                {
                    icon: 'bi-calendar-check',
                    title: 'Study Planner',
                    description: 'Structured schedules for exam success.',
                    link: '/productivity/study-planner',
                    badge: 'New',
                    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                },
                {
                    icon: 'bi-list-check',
                    title: 'Task Breakdown',
                    description: 'Deconstruct big goals into micro-tasks.',
                    link: '/productivity/task-breakdown',
                    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                },
                {
                    icon: 'bi-people',
                    title: 'Meeting Analyzer',
                    description: 'Extract structured insights from meeting notes.',
                    link: '/enterprise-tools/meeting-analyzer',
                    gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                },
                {
                    icon: 'bi-envelope',
                    title: 'Email Drafter',
                    description: 'High-impact professional drafts.',
                    link: '/enterprise-tools/email-drafter',
                    gradient: 'linear-gradient(135deg, #f59e0b, #d946ef)',
                }
            ]
        },
        {
            title: 'Lifestyle & Travel',
            tools: [
                {
                    icon: 'bi-airplane',
                    title: 'Travel Itinerary',
                    description: 'Smart day-by-day travel planning.',
                    link: '/lifestyle/itinerary-generator',
                    badge: 'New',
                    gradient: 'linear-gradient(135deg, #06b6d4, #10b981)',
                }
            ]
        }
    ];

    ngOnInit() {
        this.store.setActiveTool('dashboard');
    }
}
