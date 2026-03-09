import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-matcher',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="matcher-container card stack gap-6 fade-in">
            <div class="matcher-header flex-between">
                <div class="header-title stack gap-2">
                    <h3 class="font-bold">Resume Matcher AI</h3>
                    <p class="text-xs text-muted">Optimize for specific Job Descriptions</p>
                </div>
                <span class="badge badge-indigo">BETA</span>
            </div>

            <div class="matcher-body stack gap-4">
                <textarea class="textarea jd-input" 
                    [(ngModel)]="resumeService.jdText" 
                    placeholder="Paste the Job Description here to analyze compatibility..." 
                    rows="6"></textarea>
                
                @if (resumeService.alignmentScore() !== null) {
                    <div class="results-view stack gap-4 p-4 border rounded-xl bg-base">
                        <div class="score-display flex items-center gap-4">
                            <div class="score-pill">{{ resumeService.alignmentScore() }}%</div>
                            <div class="score-label">
                                <p class="font-bold">Match Score</p>
                                <p class="text-xs text-muted">Based on keywords & experience</p>
                            </div>
                        </div>

                        <div class="tips-list stack gap-2">
                            @for (tip of resumeService.alignmentTips(); track tip) {
                                <div class="tip-item flex gap-2">
                                    <i class="bi bi-lightbulb text-accent"></i>
                                    <span class="text-sm">{{ tip }}</span>
                                </div>
                            }
                        </div>
                    </div>
                }

                <button class="btn btn-primary btn-sm" 
                    (click)="resumeService.analyzeJD()" 
                    [disabled]="resumeService.loading() || !resumeService.jdText().trim()">
                    @if (resumeService.loading()) {
                        <span class="spinner-border spinner-border-sm me-2"></span> Analyzing...
                    } @else {
                        <i class="bi bi-cpu"></i> Match Resume
                    }
                </button>
            </div>
        </div>
    `,
    styles: [`
        .matcher-container {
            padding: var(--space-6);
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
        }
        .jd-input { font-size: var(--text-sm); line-height: 1.5; }
        .score-pill {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--accent);
            color: white;
            font-weight: 800;
            border-radius: var(--radius-lg);
            font-size: var(--text-lg);
        }
        .tip-item { line-height: 1.4; color: var(--text-secondary); }
    `]
})
export class ResumeMatcherComponent {
    resumeService = inject(ResumeService);
}
