import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildCareerRoadmapPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-career-roadmap',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './career-roadmap.component.html',
    styleUrl: './career-roadmap.component.css',
})
export class CareerRoadmapComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    goal = signal<string>('');
    currentLevel = signal<string>('Beginner');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('career-roadmap');
    }

    async generateRoadmap() {
        if (!this.goal().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildCareerRoadmapPrompt(
            this.goal(),
            this.currentLevel()
        );

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'career-roadmap',
            model: MODELS.PRIMARY
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'career-roadmap',
                    prompt: `Career Roadmap to: ${this.goal()}`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate career roadmap.');
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
