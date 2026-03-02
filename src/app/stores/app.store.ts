import { Injectable, signal, computed, effect } from '@angular/core';
import {
    ToolType,
    PromptHistory,
    PromptTemplate,
    ToolUsage,
    AppPreferences,
    ChannelType,
} from '../core/ai/ai.model';
import { StorageService } from '../shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AppStore {
    // ── Signals ────────────────────────────────────────────────────────────────
    readonly activeTool = signal<ToolType>('dashboard');
    readonly activeChannel = signal<ChannelType>('all');
    readonly sidebarCollapsed = signal<boolean>(false);
    readonly isLoading = signal<boolean>(false);
    readonly promptHistory = signal<PromptHistory[]>([]);
    readonly savedTemplates = signal<PromptTemplate[]>([]);
    readonly toolUsage = signal<ToolUsage[]>([]);

    // ── Computed ───────────────────────────────────────────────────────────────
    readonly totalPrompts = computed(() => this.promptHistory().length);
    readonly recentHistory = computed(() =>
        [...this.promptHistory()]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)
    );
    readonly topTools = computed(() =>
        [...this.toolUsage()]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    );

    constructor(private storage: StorageService) {
        this.loadFromStorage();
        this.setupPersistence();
    }

    // ── Actions ────────────────────────────────────────────────────────────────
    setActiveTool(tool: ToolType): void {
        this.activeTool.set(tool);
        this.storage.set('lastActiveTool', tool);
    }

    setActiveChannel(channel: ChannelType): void {
        this.activeChannel.set(channel);
        this.storage.set('activeChannel', channel);
    }

    toggleSidebar(): void {
        const next = !this.sidebarCollapsed();
        this.sidebarCollapsed.set(next);
        this.storage.set('sidebarCollapsed', next);
    }

    addToHistory(entry: Omit<PromptHistory, 'id'>): void {
        const record: PromptHistory = {
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        };
        this.promptHistory.update((h) => [record, ...h].slice(0, 100));
        this.incrementToolUsage(entry.tool);
    }

    clearHistory(): void {
        this.promptHistory.set([]);
        this.storage.remove('promptHistory');
    }

    saveTemplate(template: Omit<PromptTemplate, 'id'>): void {
        const t: PromptTemplate = {
            ...template,
            id: `tpl-${Date.now()}`,
        };
        this.savedTemplates.update((s) => [t, ...s]);
    }

    removeTemplate(id: string): void {
        this.savedTemplates.update((s) => s.filter((t) => t.id !== id));
    }

    setLoading(val: boolean): void {
        this.isLoading.set(val);
    }

    // ── Private ────────────────────────────────────────────────────────────────
    private loadFromStorage(): void {
        const history = this.storage.get<PromptHistory[]>('promptHistory', []);
        const templates = this.storage.get<PromptTemplate[]>('savedTemplates', []);
        const usage = this.storage.get<ToolUsage[]>('toolUsage', []);
        const lastTool = this.storage.get<ToolType>('lastActiveTool', 'dashboard');
        const lastChannel = this.storage.get<ChannelType>('activeChannel', 'all');
        const collapsed = this.storage.get<boolean>('sidebarCollapsed', false);

        this.promptHistory.set(history);
        this.savedTemplates.set(templates);
        this.toolUsage.set(usage);
        this.activeTool.set(lastTool);
        this.activeChannel.set(lastChannel);
        this.sidebarCollapsed.set(collapsed);
    }

    private setupPersistence(): void {
        effect(() => {
            this.storage.set('promptHistory', this.promptHistory());
        });
        effect(() => {
            this.storage.set('savedTemplates', this.savedTemplates());
        });
        effect(() => {
            this.storage.set('toolUsage', this.toolUsage());
        });
    }

    private incrementToolUsage(tool: ToolType): void {
        this.toolUsage.update((usage) => {
            const existing = usage.find((u) => u.tool === tool);
            if (existing) {
                return usage.map((u) =>
                    u.tool === tool ? { ...u, count: u.count + 1, lastUsed: new Date() } : u
                );
            }
            return [...usage, { tool, count: 1, lastUsed: new Date() }];
        });
    }
}
