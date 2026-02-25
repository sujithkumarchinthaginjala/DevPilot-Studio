import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIResponse } from '../../../core/ai/ai.model';

@Component({
    selector: 'app-ai-response',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ai-response.component.html',
    styleUrl: './ai-response.component.css',
})
export class AiResponseComponent {
    @Input() response: AIResponse | null = null;
    @Input() error: string | null = null;
    @Output() copied = new EventEmitter<void>();

    isCopied = false;

    copyToClipboard(): void {
        if (!this.response?.content) return;
        navigator.clipboard.writeText(this.response.content).then(() => {
            this.isCopied = true;
            this.copied.emit();
            setTimeout(() => (this.isCopied = false), 2500);
        });
    }

    formatContent(content: string): string {
        return content
            .replace(/## (.*?)(\n|$)/g, '<h3 class="response-h3">$1</h3>')
            .replace(/### (.*?)(\n|$)/g, '<h4 class="response-h4">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`{3}([\s\S]*?)`{3}/g, '<pre class="code-block">$1</pre>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/^- (.*?)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul class="response-list">$1</ul>')
            .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }
}
