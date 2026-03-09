import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-header',
    standalone: true,
    imports: [CommonModule],
    template: `
        <header class="tool-header no-print">
            <div class="tool-header__info">
                <h1 class="tool-header__title">Adaptive Smart Resume</h1>
                <div class="breadcrumb">
                    <span class="badge badge-indigo">{{ resumeService.profileType() | titlecase }} Track</span>
                    <span class="badge badge-ghost">{{ resumeService.activeSection()?.title }}</span>
                </div>
            </div>
            <div class="tool-header__actions">
                <div class="template-selector">
                    <button class="btn btn-ghost" [class.active]="resumeService.activeTemplate() === 'ats'"
                        (click)="resumeService.activeTemplate.set('ats')">
                        <i class="bi bi-layout-text-window"></i> ATS
                    </button>
                    <button class="btn btn-ghost" [class.active]="resumeService.activeTemplate() === 'modern'"
                        (click)="resumeService.activeTemplate.set('modern')">
                        <i class="bi bi-columns-gap"></i> Modern
                    </button>
                    <button class="btn btn-ghost" [class.active]="resumeService.activeTemplate() === 'creative'"
                        (click)="resumeService.activeTemplate.set('creative')">
                        <i class="bi bi-palette"></i> Creative
                    </button>
                </div>

                <button class="btn btn-ghost text-danger" (click)="resumeService.reset()">
                    <i class="bi bi-trash"></i> Reset
                </button>
            </div>
        </header>
    `,
    styles: [`
        .tool-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: var(--space-6);
            border-bottom: 1px solid var(--border-subtle);
            margin-bottom: var(--space-8);
        }
        .tool-header__info {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
        }
        .tool-header__title {
            font-size: var(--text-2xl);
            font-weight: 800;
            color: var(--text-primary);
        }
        .breadcrumb {
            display: flex;
            gap: var(--space-2);
        }
        .tool-header__actions {
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }
        .template-selector {
            display: flex;
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg);
            padding: 2px;
            gap: var(--space-2);
        }
        .template-selector .btn {
            border: none;
            padding: 6px 12px;
            font-size: var(--text-sm);
        }
        .template-selector .btn.active {
            background: var(--accent);
            color: white;
        }
    `]
})
export class ResumeHeaderComponent {
    resumeService = inject(ResumeService);
}
