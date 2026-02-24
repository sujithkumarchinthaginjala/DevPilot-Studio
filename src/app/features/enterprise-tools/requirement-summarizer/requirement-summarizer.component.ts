import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildRequirementSummarizerPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-requirement-summarizer',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './requirement-summarizer.component.html',
    styleUrl: './requirement-summarizer.component.css',
})
export class RequirementSummarizerComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    requirements = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('requirement-summarizer');
    }

    async summarize() {
        if (!this.requirements().trim()) return;
        this.loading.set(true);
        this.error.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildRequirementSummarizerPrompt(this.requirements());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'requirement-summarizer'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'requirement-summarizer',
                    prompt: `Summarized reqs: ${this.requirements().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to summarize requirements.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.requirements.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
