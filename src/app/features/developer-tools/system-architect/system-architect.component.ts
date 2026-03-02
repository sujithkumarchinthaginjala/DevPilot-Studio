import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildSystemArchitectPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-system-architect',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './system-architect.component.html',
    styleUrl: './system-architect.component.css'
})
export class SystemArchitectComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    goal = signal<string>('');
    requirements = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('system-architect');
    }

    async generateArchitecture() {
        if (!this.goal().trim()) return;
        this.loading.set(true);
        this.response.set(null);
        this.store.setLoading(true);

        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildSystemArchitectPrompt(this.goal(), this.requirements());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'system-architect'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'system-architect',
                    prompt: `System Design: ${this.goal().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate architecture.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.goal.set('');
        this.requirements.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
