import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildSwotAnalysisPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-swot-analysis',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './swot-analysis.component.html',
    styleUrl: './swot-analysis.component.css'
})
export class SwotAnalysisComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    businessName = signal<string>('');
    description = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('swot-analysis');
    }

    async generateSwot() {
        if (!this.businessName().trim()) return;
        this.loading.set(true);
        this.response.set(null);
        this.store.setLoading(true);

        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildSwotAnalysisPrompt(this.businessName(), this.description());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'swot-analysis'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'swot-analysis',
                    prompt: `SWOT: ${this.businessName()}`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate SWOT analysis.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.businessName.set('');
        this.description.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
