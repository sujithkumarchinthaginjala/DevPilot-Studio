import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../stores/app.store';
import { ResumeService } from './services/resume.service';
import { ResumeHeaderComponent } from './components/resume-header/resume-header.component';
import { ResumeOnboardingComponent } from './components/resume-onboarding/resume-onboarding.component';
import { ResumeStepperComponent } from './components/resume-stepper/resume-stepper.component';
import { ResumeSectionEditorComponent } from './components/resume-section-editor/resume-section-editor.component';
import { ResumePreviewComponent } from './components/resume-preview/resume-preview.component';
import { ResumeMatcherComponent } from './components/resume-matcher/resume-matcher.component';

@Component({
    selector: 'app-resume-builder',
    standalone: true,
    imports: [
        CommonModule,
        ResumeHeaderComponent,
        ResumeOnboardingComponent,
        ResumeStepperComponent,
        ResumeSectionEditorComponent,
        ResumePreviewComponent,
        ResumeMatcherComponent
    ],
    templateUrl: './resume-builder.component.html',
    styleUrls: ['./resume-builder.component.css'],
    providers: [ResumeService] // Providing here so state is fresh per tool visit
})
export class ResumeBuilderComponent implements OnInit {
    private store = inject(AppStore);
    public resumeService = inject(ResumeService);

    ngOnInit() {
        this.store.setActiveTool('resume-builder');
    }
}
