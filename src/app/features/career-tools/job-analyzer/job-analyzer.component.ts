import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildJobAnalyzerPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-job-analyzer',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './job-analyzer.component.html',
    styleUrl: './job-analyzer.component.css',
})
export class JobAnalyzerComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    jobDescription = signal<string>('');
    userProfile = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('job-analyzer');
    }

    async analyzeJob() {
        if (!this.jobDescription().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        // Auto-scroll to results
        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildJobAnalyzerPrompt(
            this.jobDescription(),
            this.userProfile()
        );

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'job-analyzer',
            model: MODELS.PRIMARY
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'job-analyzer',
                    prompt: `Analyzed JD: ${this.jobDescription().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to analyze job description.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.jobDescription.set('');
        this.userProfile.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
