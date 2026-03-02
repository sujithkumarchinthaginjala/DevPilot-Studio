import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildHealthyHabitsPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-healthy-habits',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './healthy-habits.component.html',
    styleUrl: './healthy-habits.component.css'
})
export class HealthyHabitsComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    goal = signal<string>('');
    lifestyle = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('healthy-habits');
    }

    async generateHabitPlan() {
        if (!this.goal().trim()) return;
        this.loading.set(true);
        this.response.set(null);
        this.store.setLoading(true);

        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildHealthyHabitsPrompt(this.goal(), this.lifestyle());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'healthy-habits'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'healthy-habits',
                    prompt: `Habit Goal: ${this.goal()}`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate habit plan.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.goal.set('');
        this.lifestyle.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
