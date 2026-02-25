import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildMockInterviewPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-mock-interview',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './mock-interview.component.html',
    styleUrl: './mock-interview.component.css',
})
export class MockInterviewComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    role = signal<string>('');
    level = signal<string>('Junior');
    focus = signal<string>('Technical');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    levels = ['Junior', 'Mid-Level', 'Senior', 'Lead/Staff'];
    focusAreas = ['Technical (General)', 'System Design', 'Behavioral/HR', 'Coding Problems', 'Domain Specific'];

    ngOnInit() {
        this.store.setActiveTool('mock-interview');
    }

    async generateInterview() {
        if (!this.role().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildMockInterviewPrompt(
            this.role(),
            this.level(),
            this.focus()
        );

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'mock-interview',
            model: MODELS.PRIMARY
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'mock-interview',
                    prompt: `Mock Interview: ${this.role()} (${this.level})`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate interview questions.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.role.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
