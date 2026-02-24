import { Component, inject, computed } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { TOOL_LABELS } from '../../core/ai/ai.model';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    store = inject(AppStore);

    activeToolLabel = computed(() => TOOL_LABELS[this.store.activeTool()]);
    totalPrompts = this.store.totalPrompts;

    newSession(): void {
        this.store.setActiveTool('dashboard');
    }

    toggleSidebar(): void {
        this.store.toggleSidebar();
    }
}
