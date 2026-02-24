import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-tool-card',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './tool-card.component.html',
    styleUrl: './tool-card.component.css',
})
export class ToolCardComponent {
    @Input() icon = '';
    @Input() title = '';
    @Input() description = '';
    @Input() link = '';
    @Input() badge = '';
    @Input() badgeClass = 'badge-primary';
    @Input() gradient = 'linear-gradient(135deg, #6366f1, #06b6d4)';
}
