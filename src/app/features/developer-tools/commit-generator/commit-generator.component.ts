import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildCommitPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-commit-generator',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './commit-generator.component.html',
    styleUrl: './commit-generator.component.css',
})
export class CommitGeneratorComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    changes = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('commit-generator');
    }

    async generateCommits() {
        if (!this.changes().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildCommitPrompt(this.changes());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'commit-generator'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'commit-generator',
                    prompt: `Generated commits for: ${this.changes().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate commit messages.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.changes.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
