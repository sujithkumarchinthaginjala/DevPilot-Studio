import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildMeetingAnalyzerPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-meeting-analyzer',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './meeting-analyzer.component.html',
    styleUrl: './meeting-analyzer.component.css',
})
export class MeetingAnalyzerComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    notes = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('meeting-analyzer');
    }

    async analyzeNotes() {
        if (!this.notes().trim()) return;
        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        // Auto-scroll to results
        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildMeetingAnalyzerPrompt(this.notes());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'meeting-analyzer'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'meeting-analyzer',
                    prompt: `Analyzed meeting: ${this.notes().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to analyze notes.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.notes.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
