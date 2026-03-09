export type ProfileType = 'fresher' | 'early' | 'experienced' | 'none';
export type TemplateType = 'ats' | 'modern' | 'creative';
export type SectionType =
    | 'personal' | 'summary' | 'education' | 'experience'
    | 'projects' | 'skills' | 'achievements' | 'certifications'
    | 'publications' | 'languages' | 'awards' | 'leadership'
    | 'patents' | 'opensource';

export interface ResumeSection {
    id: string;
    type: SectionType;
    title: string;
    items?: any[];
    data?: any;
    isVisible: boolean;
    isRemovable: boolean;
}

export interface ResumeDataV2 {
    profileType: ProfileType;
    sections: ResumeSection[];
    activeTemplate: TemplateType;
}
