import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { AIResponse } from '../../../core/ai/ai.model';
import { buildBudgetPlannerPrompt } from '../../../core/ai/prompt-builder';
import { AiResponseComponent } from '../../../shared/components/ai-response/ai-response.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-budget-planner',
    standalone: true,
    imports: [CommonModule, FormsModule, AiResponseComponent, LoadingSpinnerComponent],
    templateUrl: './budget-planner.component.html',
    styleUrl: './budget-planner.component.css'
})
export class BudgetPlannerComponent {
    aiService = inject(AiService);
    store = inject(AppStore);

    income = signal<number>(0);
    expenses = signal<string>('');
    financialGoal = signal<string>('');
    response = signal<AIResponse | null>(null);
    error = signal<string | null>(null);
    loading = signal<boolean>(false);

    ngOnInit() {
        this.store.setActiveTool('budget-planner');
    }

    async generateBudgetPlan() {
        if (this.income() <= 0) return;
        this.loading.set(true);
        this.response.set(null);
        this.store.setLoading(true);

        setTimeout(() => {
            document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const { systemPrompt, userPrompt } = buildBudgetPlannerPrompt(this.income(), this.expenses(), this.financialGoal());

        this.aiService.sendPrompt({
            prompt: userPrompt,
            systemPrompt,
            tool: 'budget-planner'
        }).subscribe({
            next: (res) => {
                this.response.set(res);
                this.loading.set(false);
                this.store.setLoading(false);
                this.store.addToHistory({
                    tool: 'budget-planner',
                    prompt: `Budget Plan for Goal: ${this.financialGoal()}`,
                    response: res.content,
                    timestamp: new Date()
                });
            },
            error: (err) => {
                this.error.set(err.message || 'Failed to generate budget plan.');
                this.loading.set(false);
                this.store.setLoading(false);
            }
        });
    }

    clear() {
        this.income.set(0);
        this.expenses.set('');
        this.financialGoal.set('');
        this.response.set(null);
        this.error.set(null);
    }
}
