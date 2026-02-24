import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
    imports: [RouterLink, RouterLinkActive],
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
                { icon: '⬡', label: 'Dashboard', route: '/dashboard' },
            ],
        },
        {
            title: 'Developer Tools',
            items: [
                { icon: '⌨', label: 'Code Assistant', route: '/developer-tools/code-assistant', badge: 'AI' },
                { icon: '✦', label: 'Commit Generator', route: '/developer-tools/commit-generator' },
                { icon: '⚗', label: 'Test Generator', route: '/developer-tools/test-generator' },
            ],
        },
        {
            title: 'Enterprise Tools',
            items: [
                { icon: '📋', label: 'Meeting Analyzer', route: '/enterprise-tools/meeting-analyzer' },
                { icon: '📄', label: 'Req. Summarizer', route: '/enterprise-tools/requirement-summarizer' },
                { icon: '✉', label: 'Email Drafter', route: '/enterprise-tools/email-drafter' },
                { icon: '📊', label: 'Perf. Review', route: '/enterprise-tools/performance-review' },
            ],
        },
    ];
}
