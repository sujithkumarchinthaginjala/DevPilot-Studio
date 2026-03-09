import { Injectable, signal, computed, inject } from '@angular/core';
import { AiService } from '../../../../core/ai/ai.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
    ResumeSection,
    ProfileType,
    TemplateType,
    SectionType,
    ResumeDataV2
} from '../models/resume.models';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private aiService = inject(AiService);
    private storage = inject(StorageService);

    // State
    profileType = signal<ProfileType>('none');
    activeTemplate = signal<TemplateType>('ats');
    activeSectionId = signal<string>('personal');
    sections = signal<ResumeSection[]>([]);
    loading = signal<boolean>(false);
    saveSuccess = signal<boolean>(false);
    showModules = signal<boolean>(false);

    // AI/Match State
    jdText = signal<string>('');
    alignmentScore = signal<number | null>(null);
    alignmentTips = signal<string[]>([]);
    quantificationMode = signal<boolean>(false);

    activeSection = computed(() => this.sections().find(s => s.id === this.activeSectionId()));

    constructor() {
        this.loadResume();
    }

    loadResume() {
        const saved = this.storage.get<ResumeDataV2>('resume_v2', null!);
        if (saved) {
            this.profileType.set(saved.profileType);
            this.sections.set(saved.sections);
            this.activeTemplate.set(saved.activeTemplate);
            if (saved.sections.length > 0) {
                this.activeSectionId.set(saved.sections[0].id);
            }
        }
    }

    saveResume() {
        const data: ResumeDataV2 = {
            profileType: this.profileType(),
            sections: this.sections(),
            activeTemplate: this.activeTemplate()
        };
        this.storage.set('resume_v2', data);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 2000);
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
        const exp: ResumeSection = { id: 'experience', type: 'experience', title: 'Work Experience', items: [{ company: '', role: '', duration: '', description: '' }], isVisible: true, isRemovable: false };
        const proj: ResumeSection = { id: 'projects', type: 'projects', title: 'Key Projects', items: [{ title: '', tech: '', description: '', link: '' }], isVisible: true, isRemovable: false };
        const skills: ResumeSection = { id: 'skills', type: 'skills', title: 'Skills', items: [], isVisible: true, isRemovable: false };

        if (type === 'fresher') {
            structure.push(edu, proj, skills, exp);
        } else {
            structure.push(exp, skills, edu, proj);
        }

        this.sections.set(structure);
        this.activeSectionId.set('personal');
    }

    addSectionItem(sectionId: string) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId) {
                if (s.type === 'education') s.items = [...(s.items || []), { institution: '', degree: '', year: '', gpa: '' }];
                if (s.type === 'experience') s.items = [...(s.items || []), { company: '', role: '', duration: '', description: '' }];
                if (s.type === 'projects') s.items = [...(s.items || []), { title: '', tech: '', description: '', link: '' }];
                if (['achievements', 'certifications', 'publications', 'languages', 'awards', 'leadership', 'patents', 'opensource'].includes(s.type)) {
                    s.items = [...(s.items || []), { title: '', date: '', desc: '' }];
                }
            }
            return s;
        }));
        this.saveResume();
    }

    removeSectionItem(sectionId: string, index: number) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId && s.items) {
                const newItems = [...s.items];
                newItems.splice(index, 1);
                return { ...s, items: newItems };
            }
            return s;
        }));
        this.saveResume();
    }

    moveSection(index: number, direction: 'up' | 'down') {
        const sections = [...this.sections()];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < sections.length) {
            [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
            this.sections.set(sections);
            this.saveResume();
        }
    }

    addModule(type: SectionType) {
        const existing = this.sections().find(s => s.type === type);
        if (existing) {
            this.activeSectionId.set(existing.id);
            return;
        }

        const newSection: ResumeSection = {
            id: `${type}_${Date.now()}`,
            type: type,
            title: this.getSectionTitle(type),
            items: [],
            isVisible: true,
            isRemovable: true
        };

        this.sections.update(s => [...s, newSection]);
        this.activeSectionId.set(newSection.id);
        this.showModules.set(false);
        this.saveResume();
    }

    removeSection(id: string) {
        this.sections.update(s => s.filter(sec => sec.id !== id));
        if (this.activeSectionId() === id) {
            this.activeSectionId.set(this.sections()[0]?.id || 'personal');
        }
        this.saveResume();
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

    async improveContent(sectionId: string, itemIndex?: number, field?: string) {
        const section = this.sections().find(s => s.id === sectionId);
        if (!section) return;

        let currentContent = '';
        if (section.type === 'summary') currentContent = section.data.content;
        else if (itemIndex !== undefined && field) currentContent = section.items?.[itemIndex][field];

        if (!currentContent) return;

        this.loading.set(true);
        const mode = this.quantificationMode() ? 'Quantified Impact' : 'Standard Professional';

        this.aiService.sendPrompt({
            prompt: `As an expert resume coach, improve this ${section.type} content. Mode: ${mode}. Content: "${currentContent}". Provide ONLY the improved content.`,
            tool: 'resume-builder'
        }).subscribe({
            next: (res) => {
                this.updateContent(sectionId, res.content, itemIndex, field);
                this.loading.set(false);
                this.saveResume();
            },
            error: () => this.loading.set(false)
        });
    }

    private updateContent(sectionId: string, newContent: string, itemIndex?: number, field?: string) {
        this.sections.update(sections => sections.map(s => {
            if (s.id === sectionId) {
                if (s.type === 'summary') return { ...s, data: { ...s.data, content: newContent } };
                if (itemIndex !== undefined && field && s.items) {
                    const newItems = [...s.items];
                    newItems[itemIndex] = { ...newItems[itemIndex], [field]: newContent };
                    return { ...s, items: newItems };
                }
            }
            return s;
        }));
    }

    async analyzeJD() {
        if (!this.jdText().trim()) return;
        this.loading.set(true);

        this.aiService.sendPrompt({
            prompt: `Analyze this resume against the JD. Resume: ${JSON.stringify(this.sections())}. JD: ${this.jdText()}. Format: { "score": number, "keywords": string[], "tips": string[] }`,
            tool: 'resume-builder'
        }).subscribe({
            next: (res) => {
                try {
                    const result = JSON.parse(res.content);
                    this.alignmentScore.set(result.score);
                    this.alignmentTips.set(result.tips);
                } catch {
                    const score = parseInt(res.content.match(/\d+/)?.[0] || '0');
                    this.alignmentScore.set(score);
                }
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    reset() {
        if (confirm('Are you sure you want to reset? This will clear all current resume data.')) {
            this.profileType.set('none');
            this.sections.set([]);
            this.storage.remove('resume_v2');
        }
    }
}
