import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { StorageService } from '../../../shared/services/storage.service';
import { buildResumeBuilderPrompt } from '../../../core/ai/prompt-builder';

export type ResumeType = 'fresher' | 'experienced';

interface ResumeData {
    personal: {
        name: string;
        email: string;
        phone: string;
        linkedin: string;
        summary: string;
    };
    education: { institution: string; degree: string; year: string; gpa: string }[];
    experience: { company: string; role: string; duration: string; description: string }[];
    projects: { title: string; tech: string; description: string }[];
    skills: string[];
}

@Component({
    selector: 'app-resume-builder',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './resume-builder.component.html',
    styleUrls: ['./resume-builder.component.css'],
})
export class ResumeBuilderComponent implements OnInit {
    private aiService = inject(AiService);
    private store = inject(AppStore);
    private storage = inject(StorageService);

    userType = signal<ResumeType>('fresher');
    activeSection = signal<string>('personal');
    selectedTemplate = signal<number>(1);
    loading = signal<boolean>(false);
    saveSuccess = signal<boolean>(false);

    resumeData = signal<ResumeData>({
        personal: { name: '', email: '', phone: '', linkedin: '', summary: '' },
        education: [{ institution: '', degree: '', year: '', gpa: '' }],
        experience: [{ company: '', role: '', duration: '', description: '' }],
        projects: [{ title: '', tech: '', description: '' }],
        skills: [],
    });

    newSkill = signal<string>('');

    sections = computed(() => {
        const base = ['personal', 'education', 'skills'];
        return this.userType() === 'fresher' ? [...base, 'projects'] : [...base, 'experience'];
    });

    templates = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: i < 5 ? `ATS Friendly ${i + 1}` : `Modern Layout ${i - 4}`,
        isAts: i < 5,
    }));

    ngOnInit() {
        this.store.setActiveTool('resume-builder');
        const saved = this.storage.get<ResumeData>('resume_data', null!);
        if (saved) {
            this.resumeData.set(saved);
        }
    }

    setUserType(type: ResumeType) {
        this.userType.set(type);
        this.activeSection.set('personal');
    }

    addEducation() {
        this.resumeData.update(d => ({
            ...d,
            education: [...d.education, { institution: '', degree: '', year: '', gpa: '' }]
        }));
    }

    addExperience() {
        this.resumeData.update(d => ({
            ...d,
            experience: [...d.experience, { company: '', role: '', duration: '', description: '' }]
        }));
    }

    addProject() {
        this.resumeData.update(d => ({
            ...d,
            projects: [...d.projects, { title: '', tech: '', description: '' }]
        }));
    }

    addSkill() {
        if (this.newSkill().trim()) {
            this.resumeData.update(d => ({
                ...d,
                skills: [...d.skills, this.newSkill().trim()]
            }));
            this.newSkill.set('');
        }
    }

    removeSkill(index: number) {
        this.resumeData.update(d => ({
            ...d,
            skills: d.skills.filter((_, i) => i !== index)
        }));
    }

    improveSummary() {
        const current = this.resumeData().personal.summary;
        if (!current.trim()) return;

        this.loading.set(true);
        this.aiService.sendPrompt({
            prompt: buildResumeBuilderPrompt('Summary', current),
            tool: 'resume-builder'
        }).subscribe({
            next: (res) => {
                this.resumeData.update(d => ({
                    ...d,
                    personal: { ...d.personal, summary: res.content }
                }));
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    saveResume() {
        this.storage.set('resume_data', this.resumeData());
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 2000);
    }

    downloadPdf() {
        window.print();
    }
}
