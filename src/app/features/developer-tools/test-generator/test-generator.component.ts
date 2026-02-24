import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildTestCasePrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-test-generator',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './test-generator.component.html',
    styleUrl: './test-generator.component.css',
})
export class TestGeneratorComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    code = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('test-generator');
    }

    async generateTests() {
        if (!this.code().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildTestCasePrompt(this.code());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'test-generator'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'test-generator',
                    prompt: `Generated tests for: ${this.code().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate tests.');
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
