import { Component, HostListener, OnInit, ElementRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { AppStore } from '../../stores/app.store';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
    private store = inject(AppStore);
    private el = inject(ElementRef);

    ngOnInit() {
        this.checkInitialMobileState();
    }

    private checkInitialMobileState() {
        // On initial load, if it's a mobile device, start with the sidebar collapsed
        if (window.innerWidth <= 1024) {
            this.store.sidebarCollapsed.set(true);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        // If we resize down to mobile, automatically collapse the sidebar
        if (window.innerWidth <= 1024) {
             this.store.sidebarCollapsed.set(true);
        } else {
             // If we resize up to desktop, automatically open it
             this.store.sidebarCollapsed.set(false);
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        // Only apply this logic on mobile/tablet breakpoints
        if (window.innerWidth > 1024) return;

        // If sidebar is already closed, do nothing
        if (this.store.sidebarCollapsed()) return;

        const targetElement = event.target as HTMLElement;

        // Check if the click happened inside the sidebar OR inside the hamburger toggle button
        const clickedInsideSidebar = targetElement.closest('.sidebar');
        const clickedInsideToggle = targetElement.closest('.header__toggle');

        // If clicked outside both, forcefully collapse the sidebar
        if (!clickedInsideSidebar && !clickedInsideToggle) {
            this.store.sidebarCollapsed.set(true);
        }
    }
}
