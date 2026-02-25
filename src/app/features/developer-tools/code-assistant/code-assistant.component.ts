import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildCodeAssistantPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-code-assistant',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './code-assistant.component.html',
    styleUrl: './code-assistant.component.css',
})
export class CodeAssistantComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    code = signal<string>('');
    mode = signal<'explain' | 'refactor' | 'improve'>('explain');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    modes: { id: 'explain' | 'refactor' | 'improve'; label: string; icon: string }[] = [
        { id: 'explain', label: 'Explain', icon: 'bi-search' },
        { id: 'refactor', label: 'Refactor', icon: 'bi-arrow-repeat' },
        { id: 'improve', label: 'Improve', icon: 'bi-rocket' },
    ];

    ngOnInit() {
        this.store.setActiveTool('code-assistant');
    }

    async processCode() {
        if (!this.code().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildCodeAssistantPrompt(this.code(), this.mode());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'code-assistant',
            mode: this.mode()
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'code-assistant',
                    prompt: `[${this.mode().toUpperCase()}] ${this.code().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date(),
                    mode: this.mode()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to process code.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.code.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
