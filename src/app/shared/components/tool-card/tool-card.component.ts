import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tool-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tool-card.component.html',
    styleUrl: './tool-card.component.css',
})
export class ToolCardComponent {
    @Input() icon: string = '';
    @Input() title = '';
    @Input() description = '';
    @Input() link = '';
    @Input() badge = '';
    @Input() badgeClass = 'badge-primary';
    @Input() gradient = 'linear-gradient(135deg, #6366f1, #06b6d4)';
}
