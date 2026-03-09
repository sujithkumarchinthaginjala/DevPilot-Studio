import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-section-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        @if (resumeService.activeSection(); as sec) {
            <div class="editor-container card fade-in">
                <div class="editor-header flex-between">
                    <div class="title-group">
                        <h2 class="title">{{ sec.title }}</h2>
                        <p class="subtitle text-xs text-muted">Customize this section for your profile</p>
                    </div>
                    <div class="header-actions">
                        <label class="toggle-sm">
                            <input type="checkbox" [checked]="resumeService.quantificationMode()" 
                                (change)="resumeService.quantificationMode.set(!resumeService.quantificationMode())">
                            <span class="toggle-track"></span>
                            <span class="toggle-label text-xs">Quantification AI</span>
                        </label>
                        @if (sec.isRemovable) {
                            <button class="btn btn-ghost text-danger btn-sm" (click)="resumeService.removeSection(sec.id)">
                                <i class="bi bi-trash"></i>
                            </button>
                        }
                    </div>
                </div>

                <div class="editor-body stack gap-6">
                    <!-- Personal Info -->
                    @if (sec.type === 'personal') {
                        <div class="form-grid stack">
                            <div class="input-group">
                                <label>Full Name</label>
                                <input class="input" [(ngModel)]="sec.data.name" placeholder="John Doe">
                            </div>
                            <div class="form-row gap-6">
                                <div class="input-group">
                                    <label>Email</label>
                                    <input class="input" [(ngModel)]="sec.data.email" placeholder="john@example.com">
                                </div>
                                <div class="input-group">
                                    <label>Phone</label>
                                    <input class="input" [(ngModel)]="sec.data.phone" placeholder="+1 (555) 000-0000">
                                </div>
                            </div>
                            <div class="form-row gap-6">
                                <div class="input-group">
                                    <label>LinkedIn</label>
                                    <input class="input" [(ngModel)]="sec.data.linkedin" placeholder="linkedin.com/in/johndoe">
                                </div>
                                <div class="input-group">
                                    <label>Location</label>
                                    <input class="input" [(ngModel)]="sec.data.location" placeholder="New York, USA">
                                </div>
                            </div>
                        </div>
                    }

                    <!-- Summary -->
                    @if (sec.type === 'summary') {
                        <div class="editor-field stack gap-2">
                            <div class="textarea-wrapper">
                                <textarea class="textarea" [(ngModel)]="sec.data.content" rows="6"
                                    placeholder="Briefly describe your professional background..."></textarea>
                                <button class="btn-context-ai btn btn-ghost btn-sm" (click)="resumeService.improveContent(sec.id)" 
                                    [disabled]="resumeService.loading()">
                                    <i class="bi bi-stars"></i> AI Improve
                                </button>
                            </div>
                        </div>
                    }

                    <!-- List Items (Education, Experience, Projects, etc) -->
                    @if (sec.items) {
                        <div class="items-stack stack gap-6">
                            @for (item of sec.items; track $index) {
                                <div class="item-card fade-in">
                                    <button class="btn-item-delete" (click)="resumeService.removeSectionItem(sec.id, $index)">×</button>
                                    
                                    <div class="form-grid stack gap-4">
                                        @if (sec.type === 'education') {
                                            <div class="input-group">
                                                <label>Institution</label>
                                                <input class="input font-bold" [(ngModel)]="item.institution">
                                            </div>
                                            <div class="form-row gap-4">
                                                <div class="input-group"><label>Degree</label><input class="input" [(ngModel)]="item.degree"></div>
                                                <div class="form-row gap-2">
                                                    <div class="input-group"><label>Year</label><input class="input" [(ngModel)]="item.year"></div>
                                                    <div class="input-group"><label>GPA</label><input class="input" [(ngModel)]="item.gpa"></div>
                                                </div>
                                            </div>
                                        }

                                        @if (sec.type === 'experience') {
                                            <div class="form-row gap-4">
                                                <div class="input-group"><label>Company</label><input class="input font-bold" [(ngModel)]="item.company"></div>
                                                <div class="input-group"><label>Role</label><input class="input font-bold" [(ngModel)]="item.role"></div>
                                            </div>
                                            <div class="input-group"><label>Duration</label><input class="input" [(ngModel)]="item.duration"></div>
                                            <div class="impact-editor stack gap-2">
                                                <label class="text-xs font-bold uppercase">Impact & Achievements</label>
                                                <div class="textarea-wrapper">
                                                    <textarea class="textarea" [(ngModel)]="item.description" rows="4"></textarea>
                                                    <button class="btn-context-ai" (click)="resumeService.improveContent(sec.id, $index, 'description')"
                                                        [disabled]="resumeService.loading()">
                                                        <i class="bi bi-stars"></i> ✨ AI Re-Write
                                                    </button>
                                                </div>
                                            </div>
                                        }

                                        @if (sec.type === 'projects') {
                                            <div class="input-group"><label>Project Title</label><input class="input font-bold" [(ngModel)]="item.title"></div>
                                            <div class="input-group"><label>Tech Stack</label><input class="input" [(ngModel)]="item.tech"></div>
                                            <div class="textarea-wrapper">
                                                <textarea class="textarea" [(ngModel)]="item.description" rows="3"></textarea>
                                                <button class="btn-context-ai btn btn-ghost btn-sm" (click)="resumeService.improveContent(sec.id, $index, 'description')"
                                                    [disabled]="resumeService.loading()">
                                                    <i class="bi bi-stars"></i> AI Improve
                                                </button>
                                            </div>
                                        }

                                        @if (['achievements', 'certifications', 'publications', 'awards', 'leadership', 'patents', 'opensource'].includes(sec.type)) {
                                            <div class="form-row gap-4">
                                                <div class="input-group"><label>Title</label><input class="input font-bold" [(ngModel)]="item.title"></div>
                                                <div class="input-group"><label>Date</label><input class="input" [(ngModel)]="item.date"></div>
                                            </div>
                                            <div class="input-group"><label>Details</label><textarea class="textarea" [(ngModel)]="item.desc" rows="2"></textarea></div>
                                        }
                                    </div>
                                </div>
                            }
                            <button class="btn btn-ghost border-dashed btn-sm" (click)="resumeService.addSectionItem(sec.id)">
                                <i class="bi bi-plus"></i> Add Item
                            </button>
                        </div>
                    }

                    <!-- Skills -->
                    @if (sec.type === 'skills') {
                        <div class="skills-editor stack gap-4">
                            <div class="input-group">
                                <label>Add Skill (Press Enter)</label>
                                <input class="input" #skInput (keyup.enter)="sec.items?.push(skInput.value); skInput.value=''; resumeService.saveResume()" placeholder="e.g. JavaScript">
                            </div>
                            <div class="skills-wrap flex gap-2 wrap">
                                @for (sk of sec.items; track $index) {
                                    <div class="skill-pill">
                                        {{ sk }} <span class="close" (click)="sec.items?.splice($index, 1); resumeService.saveResume()">×</span>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>

                <div class="editor-footer border-t pt-6 mt-6 flex-between">
                    <div class="save-status" [class.show]="resumeService.saveSuccess()">
                        <i class="bi bi-check-circle-fill"></i> Saved
                    </div>
                    <div class="nav-actions row gap-3">
                         <button class="btn btn-ghost" [disabled]="resumeService.sections().indexOf(sec) === 0"
                                (click)="resumeService.moveSection(resumeService.sections().indexOf(sec), 'up')">
                                <i class="bi bi-arrow-up"></i>
                         </button>
                         <button class="btn btn-ghost" [disabled]="resumeService.sections().indexOf(sec) === resumeService.sections().length - 1"
                                (click)="resumeService.moveSection(resumeService.sections().indexOf(sec), 'down')">
                                <i class="bi bi-arrow-down"></i>
                         </button>
                         <button class="btn btn-primary" (click)="resumeService.saveResume()">Save Progress</button>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .editor-container {
            padding: var(--space-8);
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-2xl);
        }
        .editor-header { margin-bottom: var(--space-8); }
        .title { font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); }

        .item-card {
            position: relative;
            background: var(--bg-base);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
        }

        .btn-item-delete {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            color: var(--text-muted);
            cursor: pointer;
        }
        .btn-item-delete:hover { background: var(--error); color: white; border-color: var(--error); }
        .textarea-wrapper { position: relative; }
        .btn-context-ai {
            position: absolute;
            right: 43%;
            bottom: 14%;
        }

        .skill-pill {
            background: var(--accent-offset);
            color: var(--accent);
            padding: 4px 12px;
            border-radius: var(--radius-full);
            font-size: var(--text-sm);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .skill-pill .close { cursor: pointer; opacity: 0.6; }
        .save-status {
            opacity: 0;
            color: var(--success);
            font-size: var(--text-sm);
            font-weight: 600;
            transition: opacity 0.3s;
        }
        .save-status.show { opacity: 1; }
    `]
})
export class ResumeSectionEditorComponent {
    resumeService = inject(ResumeService);
}
