import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildPerformanceReviewPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-performance-review',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './performance-review.component.html',
    styleUrl: './performance-review.component.css',
})
export class PerformanceReviewComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    context = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('performance-review');
    }

    async generateReview() {
        if (!this.context().trim()) return;
        this.loading.set(true);
        this.error.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildPerformanceReviewPrompt(this.context());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'performance-review'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'performance-review',
                    prompt: `Generated review for: ${this.context().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate performance review.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.context.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
