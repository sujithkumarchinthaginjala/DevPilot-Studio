import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../core/ai/ai.service';
import { AppStore } from '../../../stores/app.store';
import { StorageService } from '../../../shared/services/storage.service';
import { buildResumeBuilderPrompt } from '../../../core/ai/prompt-builder';

export type ProfileType = 'fresher' | 'early' | 'experienced' | 'none';
export type TemplateType = 'ats' | 'modern' | 'creative';
export type SectionType = 'personal' | 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'achievements' | 'certifications' | 'publications' | 'languages' | 'awards' | 'leadership' | 'patents' | 'opensource';

interface ResumeSection {
    id: string;
    type: SectionType;
    title: string;
    items?: any[];
    data?: any;
    isVisible: boolean;
    isRemovable: boolean;
}

interface NewResumeData {
    profileType: ProfileType;
    sections: ResumeSection[];
    activeTemplate: TemplateType;
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

    profileType = signal<ProfileType>('none');
    activeTemplate = signal<TemplateType>('ats');
    activeSectionId = signal<string>('personal');
    loading = signal<boolean>(false);
    saveSuccess = signal<boolean>(false);
    showModules: boolean = false;

    // Resume Data
    sections = signal<ResumeSection[]>([]);

    jdText = signal<string>('');
    alignmentScore = signal<number | null>(null);

    ngOnInit() {
        this.store.setActiveTool('resume-builder');
        const saved = this.storage.get<NewResumeData>('resume_v2', null!);
        if (saved) {
            this.profileType.set(saved.profileType);
            this.sections.set(saved.sections);
            this.activeTemplate.set(saved.activeTemplate);
            if (saved.sections.length > 0) {
                this.activeSectionId.set(saved.sections[0].id);
            }
        }
    }

    setProfile(type: ProfileType) {
        this.profileType.set(type);
        this.initializeSections(type);
        this.saveResume();
    }

    private initializeSections(type: ProfileType) {
        let structure: ResumeSection[] = [
            { id: 'personal', type: 'personal', title: 'Personal Info', data: { name: '', email: '', phone: '', linkedin: '', location: '' }, isVisible: true, isRemovable: false },
            { id: 'summary', type: 'summary', title: 'Professional Summary', data: { content: '' }, isVisible: true, isRemovable: false }
        ];

        const edu: ResumeSection = { id: 'education', type: 'education', title: 'Education', items: [{ institution: '', degree: '', year: '', gpa: '' }], isVisible: true, isRemovable: false };
        const exp: ResumeSection = { id: 'experience', type: 'experience', title: 'Work Experience', items: [{ company: '', role: '', duration: '', description: '', achievements: '' }], isVisible: true, isRemovable: false };
        const proj: ResumeSection = { id: 'projects', type: 'projects', title: 'Key Projects', items: [{ title: '', tech: '', description: '', link: '' }], isVisible: true, isRemovable: false };
        const skills: ResumeSection = { id: 'skills', type: 'skills', title: 'Skills', items: [], isVisible: true, isRemovable: false };

        if (type === 'fresher') {
            structure.push(edu, proj, skills, exp);
        } else if (type === 'early' || type === 'experienced') {
            structure.push(exp, skills, edu, proj);
        }

        this.sections.set(structure);
        this.activeSectionId.set('personal');
    }

    get activeSection() {
        return this.sections().find(s => s.id === this.activeSectionId());
    }

    addSectionItem(sectionId: string) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId) {
                if (s.type === 'education') s.items?.push({ institution: '', degree: '', year: '', gpa: '' });
                if (s.type === 'experience') s.items?.push({ company: '', role: '', duration: '', description: '', achievements: '' });
                if (s.type === 'projects') s.items?.push({ title: '', tech: '', description: '', link: '' });
            }
            return s;
        }));
    }

    removeSectionItem(sectionId: string, index: number) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId && s.items) {
                s.items.splice(index, 1);
            }
            return s;
        }));
    }

    moveSection(index: number, direction: 'up' | 'down') {
        const sections = [...this.sections()];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < sections.length) {
            [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
            this.sections.set(sections);
        }
    }

    addModule(type: SectionType) {
        if (this.sections().find(s => s.type === type)) return;
        const newSection: ResumeSection = {
            id: type + '_' + Date.now(),
            type: type,
            title: this.getSectionTitle(type),
            items: [],
            isVisible: true,
            isRemovable: true
        };
        this.sections.update(s => [...s, newSection]);
        this.activeSectionId.set(newSection.id);
    }

    removeSection(id: string) {
        this.sections.update(s => s.filter(sec => sec.id !== id));
        if (this.activeSectionId() === id) {
            this.activeSectionId.set(this.sections()[0]?.id);
        }
    }

    private getSectionTitle(type: SectionType): string {
        const titles: Record<SectionType, string> = {
            personal: 'Personal Info',
            summary: 'Summary',
            education: 'Education',
            experience: 'Work Experience',
            projects: 'Projects',
            skills: 'Skills',
            achievements: 'Achievements',
            certifications: 'Certifications',
            publications: 'Publications',
            languages: 'Languages',
            awards: 'Awards',
            leadership: 'Leadership',
            patents: 'Patents',
            opensource: 'Open Source'
        };
        return titles[type];
    }

    saveResume() {
        const data: NewResumeData = {
            profileType: this.profileType(),
            sections: this.sections(),
            activeTemplate: this.activeTemplate()
        };
        this.storage.set('resume_v2', data);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 2000);
    }

    async improveContent(sectionId: string, itemIndex?: number, field?: string) {
        const section = this.sections().find(s => s.id === sectionId);
        if (!section) return;

        let currentContent = '';
        if (section.type === 'summary') currentContent = section.data.content;
        else if (itemIndex !== undefined && field) currentContent = section.items?.[itemIndex][field];

        if (!currentContent) return;

        this.loading.set(true);
        this.aiService.sendPrompt({
            prompt: `As an expert resume writer, improve this ${section.type} content to be more impactful and professional: "${currentContent}". Provide improved version only.`,
            tool: 'resume-builder'
        }).subscribe({
            next: (res) => {
                this.updateContent(sectionId, res.content, itemIndex, field);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    private updateContent(sectionId: string, newContent: string, itemIndex?: number, field?: string) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId) {
                if (s.type === 'summary') s.data.content = newContent;
                else if (itemIndex !== undefined && field) s.items![itemIndex][field] = newContent;
            }
            return s;
        }));
    }

    async analyzeJD() {
        if (!this.jdText().trim()) return;
        this.loading.set(true);

        const resumeText = JSON.stringify(this.sections());

        this.aiService.sendPrompt({
            prompt: `Analyze this resume against the following Job Description. Provide a match score (0-100) and 3 short tips. Format: SCORE: 85 | TIPS: Tip 1, Tip 2... \nJD: ${this.jdText()}\nResume: ${resumeText}`,
            tool: 'resume-builder'
        }).subscribe({
            next: (res) => {
                const scoreMatch = res.content.match(/SCORE:\s*(\d+)/);
                if (scoreMatch) this.alignmentScore.set(parseInt(scoreMatch[1]));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    downloadPdf() {
        window.print();
    }

    reset() {
        if (confirm('Are you sure you want to reset? All data will be lost.')) {
            this.profileType.set('none');
            this.sections.set([]);
            this.storage.remove('resume_v2');
        }
    }
}
