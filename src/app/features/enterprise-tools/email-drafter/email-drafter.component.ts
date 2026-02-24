import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildEmailDrafterPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-email-drafter',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './email-drafter.component.html',
    styleUrl: './email-drafter.component.css',
})
export class EmailDrafterComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    context = signal<string>('');
    purpose = signal<string>('');
    tone = signal<string>('professional');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    tones: { id: string; label: string }[] = [
        { id: 'professional', label: 'Professional' },
        { id: 'friendly', label: 'Friendly' },
        { id: 'assertive', label: 'Assertive' },
        { id: 'empathetic', label: 'Empathetic' },
    ];

    ngOnInit() {
        this.store.setActiveTool('email-drafter');
    }

    async generateEmail() {
        if (!this.purpose().trim()) return;
        this.loading.set(true);
        this.error.set(null);
        this.store.setLoading(true);

        const { systemPrompt, userPrompt } = buildEmailDrafterPrompt(this.context(), this.tone(), this.purpose());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'email-drafter'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'email-drafter',
                    prompt: `Drafted: ${this.purpose().substring(0, 50)}...`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate email.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.context.set('');
        this.purpose.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
