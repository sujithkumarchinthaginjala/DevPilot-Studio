import { Component, inject, computed } from '@angular/core';
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
            title: 'Main',
            items: [
                { icon: 'bi-grid-1x2', label: 'Dashboard', route: '/dashboard' },
            ],
        },
        {
            title: 'Developer Tools',
            items: [
                { icon: 'bi-code-slash', label: 'Code Assistant', route: '/developer-tools/code-assistant', badge: 'AI' },
                { icon: 'bi-git', label: 'Commit Generator', route: '/developer-tools/commit-generator' },
                { icon: 'bi-funnel', label: 'Test Generator', route: '/developer-tools/test-generator' },
            ],
        },
        {
            title: 'Enterprise Tools',
            items: [
                { icon: 'bi-people', label: 'Meeting Analyzer', route: '/enterprise-tools/meeting-analyzer' },
                { icon: 'bi-file-earmark-text', label: 'Req. Summarizer', route: '/enterprise-tools/requirement-summarizer' },
                { icon: 'bi-envelope', label: 'Email Drafter', route: '/enterprise-tools/email-drafter' },
                { icon: 'bi-bar-chart', label: 'Perf. Review', route: '/enterprise-tools/performance-review' },
            ],
        },
    ];
}
