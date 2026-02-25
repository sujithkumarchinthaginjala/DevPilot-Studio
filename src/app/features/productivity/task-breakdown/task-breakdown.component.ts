import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildTaskBreakdownPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-task-breakdown',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './task-breakdown.component.html',
    styleUrl: './task-breakdown.component.css',
})
export class TaskBreakdownComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    goal = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('task-breakdown');
    }

    async breakdownTask() {
        if (!this.goal().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildTaskBreakdownPrompt(this.goal());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'task-breakdown',
            model: MODELS.PRIMARY
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'task-breakdown',
                    prompt: `Task Breakdown for: ${this.goal().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to breakdown task.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.goal.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
