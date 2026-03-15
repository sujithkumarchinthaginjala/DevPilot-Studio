import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';
import { ChannelType } from '../../core/ai/ai.model';

interface NavItem {
    icon: string;
    label: string;
    route: string;
    badge?: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
    channel: ChannelType;
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
    activeChannel = this.store.activeChannel;

    channels: { id: ChannelType; icon: string; label: string }[] = [
        { id: 'all', icon: 'bi-grid', label: 'All' },
        { id: 'developer', icon: 'bi-code-slash', label: 'Dev' },
        { id: 'career', icon: 'bi-briefcase', label: 'Career' },
        { id: 'enterprise', icon: 'bi-building', label: 'Ent' },
        { id: 'productivity', icon: 'bi-lightning', label: 'Prod' },
        { id: 'lifestyle', icon: 'bi-heart', label: 'Life' },
    ];

    allNavGroups: NavGroup[] = [
        {
            title: 'Overview',
            channel: 'all',
            items: [
                { icon: 'bi-grid-1x2', label: 'Dashboard', route: '/dashboard' },
            ],
        },
        {
            title: 'Career Accelerator',
            channel: 'career',
            items: [
                { icon: 'bi-file-earmark-person', label: 'Resume Optimizer', route: '/career-tools/resume-optimizer', badge: 'AI' },
                { icon: 'bi-linkedin', label: 'LinkedIn Enhancer', route: '/career-tools/linkedin-enhancer', badge: 'New' },
                { icon: 'bi-search', label: 'Job Analyzer', route: '/career-tools/job-analyzer' },
                { icon: 'bi-map', label: 'Career Roadmap', route: '/career-tools/career-roadmap' },
            ],
        },
        {
            title: 'Developer Suite',
            channel: 'developer',
            items: [
                { icon: 'bi-code-slash', label: 'Code Assistant', route: '/developer-tools/code-assistant', badge: 'AI' },
                { icon: 'bi-funnel', label: 'Test Generator', route: '/developer-tools/test-generator' },
                { icon: 'bi-diagram-3', label: 'System Architect', route: '/developer-tools/system-architect', badge: 'New' },
            ],
        },
        {
            title: 'Enterprise Tools',
            channel: 'enterprise',
            items: [
                { icon: 'bi-envelope', label: 'Email Drafter', route: '/enterprise-tools/email-drafter', badge: 'Pro' },
                { icon: 'bi-people', label: 'Meeting Analyzer', route: '/enterprise-tools/meeting-analyzer' },
            ],
        },
        {
            title: 'Productivity',
            channel: 'productivity',
            items: [
                { icon: 'bi-calendar-check', label: 'Study Planner', route: '/productivity/study-planner', badge: 'New' },
                { icon: 'bi-list-check', label: 'Task Breakdown', route: '/productivity/task-breakdown' },
                { icon: 'bi-piggy-bank', label: 'Budget Planner', route: '/productivity/budget-planner', badge: 'AI' },
            ],
        },
        {
            title: 'Lifestyle',
            channel: 'lifestyle',
            items: [
                { icon: 'bi-airplane', label: 'Travel Itinerary', route: '/lifestyle/itinerary-generator', badge: 'New' },
            ],
        },
    ];

    get navGroups(): NavGroup[] {
        const active = this.activeChannel();
        if (active === 'all') return this.allNavGroups;
        return this.allNavGroups.filter(g => g.channel === active || g.channel === 'all');
    }

    setChannel(id: ChannelType): void {
        this.store.setActiveChannel(id);
    }

    closeSidebar(): void {
        // Auto-close sidebar on mobile/tablet devices (width <= 1024px)
        if (window.innerWidth <= 1024) {
            this.store.sidebarCollapsed.set(true);
        }
    }
}
