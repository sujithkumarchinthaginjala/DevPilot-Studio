import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-preview',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="preview-container stack gap-6">
            <div class="preview-toolbar no-print flex-between">
                <div class="toolbar-info">
                    <h3 class="text-sm font-bold">Live Preview</h3>
                    <p class="text-xs text-muted">A4 Paper View</p>
                </div>
                <button class="btn btn-primary btn-sm" (click)="downloadPdf()">
                    <i class="bi bi-file-earmark-pdf"></i> Download PDF
                </button>
            </div>

            <div class="resume-sheet" [attr.data-template]="resumeService.activeTemplate()">
                @for (sec of resumeService.sections(); track sec.id) {
                    @if (sec.isVisible) {
                        @if (sec.type === 'personal') {
                            <div class="p-header">
                                <h1 class="p-name">{{ sec.data.name || 'YOUR NAME' }}</h1>
                                <div class="p-meta">
                                    <span>{{ sec.data.email }}</span>
                                    <span class="dot">·</span>
                                    <span>{{ sec.data.phone }}</span>
                                    <span class="dot">·</span>
                                    <span>{{ sec.data.location }}</span>
                                </div>
                                <div class="p-links">{{ sec.data.linkedin }}</div>
                            </div>
                        }

                        @if (sec.type === 'summary' && sec.data.content) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                <p class="p-body">{{ sec.data.content }}</p>
                            </div>
                        }

                        @if (sec.type === 'experience' && sec.items?.length) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                @for (item of sec.items; track $index) {
                                    <div class="p-item mb-4">
                                        <div class="item-spread">
                                            <span class="item-bold">{{ item.role }}</span>
                                            <span class="item-date">{{ item.duration }}</span>
                                        </div>
                                        <div class="item-sub italic">{{ item.company }}</div>
                                        <p class="p-body">{{ item.description }}</p>
                                    </div>
                                }
                            </div>
                        }

                         @if (sec.type === 'education' && sec.items?.length) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                @for (item of sec.items; track $index) {
                                    <div class="p-item mb-4">
                                        <div class="item-spread">
                                            <span class="item-bold">{{ item.institution }}</span>
                                            <span class="item-date">{{ item.year }}</span>
                                        </div>
                                        <div class="item-sub">{{ item.degree }} @if(item.gpa){ | GPA: {{item.gpa}} }</div>
                                    </div>
                                }
                            </div>
                        }

                        @if (sec.type === 'skills' && sec.items?.length) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                <div class="p-skills flex gap-2 wrap">
                                    @for (sk of sec.items; track $index) {
                                        <span class="p-skill-tag">{{ sk }}</span>
                                    }
                                </div>
                            </div>
                        }

                        @if (sec.type === 'projects' && sec.items?.length) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                @for (item of sec.items; track $index) {
                                    <div class="p-item mb-4">
                                        <div class="item-spread">
                                            <span class="item-bold">{{ item.title }}</span>
                                            <span class="item-tech italic text-xs">{{ item.tech }}</span>
                                        </div>
                                        <p class="p-body">{{ item.description }}</p>
                                    </div>
                                }
                            </div>
                        }

                        @if (['achievements', 'certifications', 'publications', 'awards', 'leadership', 'patents', 'opensource'].includes(sec.type) && sec.items?.length) {
                            <div class="p-section">
                                <h2 class="p-title">{{ sec.title }}</h2>
                                @for (item of sec.items; track $index) {
                                    <div class="p-item mb-2">
                                        <div class="item-spread">
                                            <span class="item-bold text-sm">{{ item.title }}</span>
                                            <span class="item-date text-xs">{{ item.date }}</span>
                                        </div>
                                        @if(item.desc){ <p class="p-body text-xs opacity-80">{{ item.desc }}</p> }
                                    </div>
                                }
                            </div>
                        }
                    }
                }
            </div>
        </div>
    `,
    styles: [`
        .preview-container {
            background: var(--bg-base);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-2xl);
            padding: var(--space-8);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .preview-toolbar { width: 100%; margin-bottom: var(--space-6); }
        .resume-sheet {
            background: white;
            color: #1a1a1a;
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            box-shadow: var(--shadow-2xl);
            font-family: 'Inter', sans-serif;
            transform: scale(0.8);
            transform-origin: top center;
            margin-bottom: -60mm;
        }
        @media (max-width: 1024px) { .resume-sheet { transform: scale(0.6); margin-bottom: -120mm; } }
        @media (max-width: 768px) { .resume-sheet { transform: scale(0.45); margin-bottom: -160mm; } }

        /* Resume Sections Internal Styling */
        .p-header { text-align: center; margin-bottom: 20pt; border-bottom: 1px solid #000; padding-bottom: 10pt; }
        .p-name { font-size: 24pt; font-weight: 800; margin-bottom: 5pt; }
        .p-meta { display: flex; justify-content: center; gap: 8pt; font-size: 9pt; }
        .p-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; border-bottom: 0.5pt solid #000; margin: 12pt 0 6pt; }
        .p-body { font-size: 10pt; line-height: 1.4; color: #333; white-space: pre-wrap; margin-top: 2pt; }
        .item-spread { display: flex; justify-content: space-between; align-items: baseline; }
        .item-bold { font-weight: 700; font-size: 10.5pt; }
        .item-date, .item-tech { color: #555; font-size: 9pt; }
        .p-skill-tag { background: #f0f0f0; padding: 2pt 6pt; border-radius: 3pt; font-size: 9pt; font-weight: 500; }
        
        [data-template=modern] .p-header { border-left: 4pt solid var(--accent); border-bottom: none; text-align: left; padding-left: 15pt; }
        [data-template=modern] .p-name { color: var(--accent); }
    `]
})
export class ResumePreviewComponent {
    resumeService = inject(ResumeService);

    downloadPdf() {
        window.print();
    }
}
