import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse, MODELS } from '../../../core/ai/ai.model';
import { buildLinkedInEnhancerPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-linkedin-enhancer',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './linkedin-enhancer.component.html',
    styleUrl: './linkedin-enhancer.component.css',
})
export class LinkedinEnhancerComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    aboutContent = signal<string>('');
    experienceContent = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('linkedin-enhancer');
    }

    async enhanceProfile() {
        if (!this.aboutContent().trim() && !this.experienceContent().trim()) return;

        this.loading.set(true);
        this.error.set(null);
        this.response.set(null);
        this.store.setLoading(true);

        // Auto-scroll to results
        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildLinkedInEnhancerPrompt(
            this.aboutContent(),
            this.experienceContent()
        );

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'linkedin-enhancer',
            model: MODELS.POLISH // Using Claude Haiku for professional writing balance
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'linkedin-enhancer',
                    prompt: `LinkedIn Enhancer for: ${this.aboutContent().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to enhance profile.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.aboutContent.set('');
        this.experienceContent.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
