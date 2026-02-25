import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';

interface NavItem {
    icon: string;
    label: string;
    route: string;
    badge?: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    store = inject(AppStore);
    collapsed = this.store.sidebarCollapsed;

    navGroups: NavGroup[] = [
        {
            title: 'Overview',
            items: [
                { icon: 'bi-grid-1x2', label: 'Dashboard', route: '/dashboard' },
            ],
        },
        {
            title: 'Career Accelerator',
            items: [
                { icon: 'bi-file-earmark-person', label: 'Resume Optimizer', route: '/career-tools/resume-optimizer', badge: 'AI' },
                { icon: 'bi-linkedin', label: 'LinkedIn Enhancer', route: '/career-tools/linkedin-enhancer', badge: 'New' },
                { icon: 'bi-search', label: 'Job Analyzer', route: '/career-tools/job-analyzer' },
                { icon: 'bi-chat-dots', label: 'Mock Interview', route: '/career-tools/mock-interview' },
                { icon: 'bi-map', label: 'Career Roadmap', route: '/career-tools/career-roadmap' },
            ],
        },
        {
            title: 'Developer Suite',
            items: [
                { icon: 'bi-code-slash', label: 'Code Assistant', route: '/developer-tools/code-assistant', badge: 'AI' },
                { icon: 'bi-git', label: 'Commit Generator', route: '/developer-tools/commit-generator' },
                { icon: 'bi-funnel', label: 'Test Generator', route: '/developer-tools/test-generator' },
            ],
        },
        {
            title: 'Productivity',
            items: [
                { icon: 'bi-envelope', label: 'Email Drafter', route: '/enterprise-tools/email-drafter', badge: 'Pro' },
                { icon: 'bi-calendar-check', label: 'Study Planner', route: '/productivity/study-planner', badge: 'New' },
                { icon: 'bi-list-check', label: 'Task Breakdown', route: '/productivity/task-breakdown' },
                { icon: 'bi-people', label: 'Meeting Analyzer', route: '/enterprise-tools/meeting-analyzer' },
                { icon: 'bi-file-earmark-text', label: 'Req. Summarizer', route: '/enterprise-tools/requirement-summarizer' },
                { icon: 'bi-bar-chart', label: 'Perf. Review', route: '/enterprise-tools/performance-review' },
            ],
        },
        {
            title: 'Lifestyle',
            items: [
                { icon: 'bi-airplane', label: 'Travel Itinerary', route: '/lifestyle/itinerary-generator', badge: 'New' },
            ],
        },
    ];

    closeSidebar(): void {
        // Only auto-close sidebar on mobile devices (width <= 768px)
        if (window.innerWidth <= 768) {
            this.store.sidebarCollapsed.set(true);
        }
    }
}
