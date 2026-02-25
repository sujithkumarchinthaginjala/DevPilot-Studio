import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildItineraryGeneratorPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-itinerary-generator',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './itinerary-generator.component.html',
    styleUrl: './itinerary-generator.component.css',
})
export class ItineraryGeneratorComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    destination = signal<string>('');
    days = signal<number>(3);
    budget = signal<string>('Moderate');
    interests = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    budgets = ['Budget-Friendly', 'Moderate', 'Luxury', 'Backpacker'];

    ngOnInit() {
        this.store.setActiveTool('itinerary-generator');
    }

    async generateItinerary() {
        if (!this.destination().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildItineraryGeneratorPrompt(
            this.destination(),
            this.days(),
            this.budget(),
            this.interests()
        );

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'itinerary-generator',
            model: MODELS.PRIMARY
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'itinerary-generator',
                    prompt: `${this.days()} days in ${this.destination()}`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate itinerary.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.destination.set('');
        this.interests.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
