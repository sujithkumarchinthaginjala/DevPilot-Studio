import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';

@Component({
    selector: 'app-resume-onboarding',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="onboarding-container fade-in">
            <div class="onboarding-content animate-up">
                <h1 class="onboarding-title">Build your premium resume</h1>
                <p class="onboarding-desc">Choose your career stage to personalize your sections and AI coaching.</p>

                <div class="profile-grid">
                    <div class="profile-option card" (click)="resumeService.setProfile('fresher')">
                        <div class="profile-icon">🎓</div>
                        <div class="profile-info">
                            <h3>Fresher / Student</h3>
                            <p>Focus on Education, Projects & Skills</p>
                        </div>
                    </div>
                    <div class="profile-option card" (click)="resumeService.setProfile('early')">
                        <div class="profile-icon">🚀</div>
                        <div class="profile-info">
                            <h3>Early Professional</h3>
                            <p>1–3 years experience. Core base.</p>
                        </div>
                    </div>
                    <div class="profile-option card" (click)="resumeService.setProfile('experienced')">
                        <div class="profile-icon">💼</div>
                        <div class="profile-info">
                            <h3>Experienced Expert</h3>
                            <p>3+ years. Leadership & Impact.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .onboarding-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-20) 0;
            min-height: 60vh;
        }
        .onboarding-content {
            max-width: 900px;
            width: 100%;
            text-align: center;
        }
        .onboarding-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: var(--space-4);
        }
        .onboarding-desc {
            font-size: var(--text-lg);
            color: var(--text-secondary);
            margin-bottom: var(--space-12);
        }
        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--space-6);
        }
        .profile-option {
            text-align: left;
            padding: var(--space-8);
            cursor: pointer;
            transition: all 0.3s var(--ease-out);
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
        }
        .profile-option:hover {
            border-color: var(--accent);
            background: var(--bg-hover);
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
        }
        .profile-icon {
            font-size: 3rem;
            margin-bottom: var(--space-6);
        }
        .profile-info h3 {
            font-size: var(--text-xl);
            font-weight: 700;
            margin-bottom: var(--space-2);
        }
    `]
})
export class ResumeOnboardingComponent {
    resumeService = inject(ResumeService);
}
