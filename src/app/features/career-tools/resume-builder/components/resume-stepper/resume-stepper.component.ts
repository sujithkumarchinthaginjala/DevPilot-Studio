import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-stepper',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="stepper-wrapper no-print">
            <div class="stepper-scroll-container">
                <div class="stepper-track">
                    @for (section of resumeService.sections(); track section.id; let i = $index) {
                        <div class="step-item" 
                             [class.active]="resumeService.activeSectionId() === section.id"
                             (click)="resumeService.activeSectionId.set(section.id)">
                            <div class="step-icon">
                                @if (resumeService.activeSectionId() === section.id) {
                                    <i class="bi bi-pencil-fill"></i>
                                } @else {
                                    <span>{{ i + 1 }}</span>
                                }
                            </div>
                            <span class="step-label">{{ section.title }}</span>
                        </div>
                        @if (i < resumeService.sections().length - 1) {
                            <div class="step-connector"></div>
                        }
                    }
                </div>
            </div>

            <div class="stepper-actions">
                <button class="btn btn-ghost btn-sm" (click)="resumeService.showModules.set(!resumeService.showModules())">
                    <i class="bi bi-plus-circle"></i> Add Module
                </button>

                @if (resumeService.showModules()) {
                    <div class="modules-popover card fade-in zoom-in">
                        <div class="popover-header">Customize Resume</div>
                        <div class="modules-grid">
                            <button (click)="resumeService.addModule('achievements')">🏆 Achievements</button>
                            <button (click)="resumeService.addModule('certifications')">📜 Certifications</button>
                            <button (click)="resumeService.addModule('leadership')">👔 Leadership</button>
                            <button (click)="resumeService.addModule('awards')">🎖️ Awards</button>
                            <button (click)="resumeService.addModule('publications')">📚 Publications</button>
                            <button (click)="resumeService.addModule('languages')">🗣️ Languages</button>
                            <button (click)="resumeService.addModule('opensource')">🌐 Open Source</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        .stepper-wrapper {
            background: var(--bg-surface);
            border-radius: var(--radius-2xl);
            border: 1px solid var(--border-subtle);
            padding: var(--space-2) var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-4);
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: var(--shadow-sm);
        }
        .stepper-scroll-container {
            overflow-x: auto;
            flex: 1;
            scrollbar-width: none;
        }
        .stepper-scroll-container::-webkit-scrollbar { display: none; }
        .stepper-track {
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }
        .step-item {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            cursor: pointer;
            padding: var(--space-2) var(--space-3);
            border-radius: var(--radius-lg);
            opacity: 0.5;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .step-item.active {
            opacity: 1;
            background: var(--accent-soft);
            color: var(--accent);
        }
        .step-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--bg-base);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .step-item.active .step-icon {
            background: var(--accent);
            color: white;
        }
        .step-connector {
            width: 16px;
            height: 1px;
            background: var(--border-subtle);
        }
        .stepper-actions { position: relative; }
        .modules-popover {
            position: absolute;
            top: calc(100% + 12px);
            right: 0;
            width: 240px;
            z-index: 60;
            padding: var(--space-4);
        }
        .popover-header {
            font-weight: 700;
            font-size: var(--text-xs);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: var(--space-3);
        }
        .modules-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-1);
        }
        .modules-grid button {
            text-align: left;
            padding: 8px 12px;
            font-size: var(--text-sm);
            border-radius: var(--radius-md);
            border: 1px solid transparent;
            background: transparent;
            color: var(--text-primary);
        }
        .modules-grid button:hover {
            background: var(--accent-soft);
            border-color: var(--accent-soft);
        }
    `]
})
export class ResumeStepperComponent {
    resumeService = inject(ResumeService);
}
