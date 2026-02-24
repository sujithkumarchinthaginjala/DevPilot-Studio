import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private prefix = 'devpilot_';

    get<T>(key: string, defaultValue: T): T {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (raw === null) return defaultValue;
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue;
        }
    }

    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (e) {
            console.warn('[StorageService] Failed to write to localStorage:', e);
        }
    }

    remove(key: string): void {
        localStorage.removeItem(this.prefix + key);
    }

    clear(): void {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(this.prefix))
            .forEach((k) => localStorage.removeItem(k));
    }
}
