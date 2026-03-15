import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private prefix = 'propilot_';

    get<T>(key: string, defaultValue: T): T {
        try {
            const raw = sessionStorage.getItem(this.prefix + key);
            if (raw === null) return defaultValue;
            return JSON.parse(raw) as T;
        } catch {
            return defaultValue;
        }
    }

    set<T>(key: string, value: T): void {
        try {
            sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (e) {
            console.warn('[StorageService] Failed to write to sessionStorage:', e);
        }
    }

    remove(key: string): void {
        sessionStorage.removeItem(this.prefix + key);
    }

    clear(): void {
        Object.keys(sessionStorage)
            .filter((k) => k.startsWith(this.prefix))
            .forEach((k) => sessionStorage.removeItem(k));
    }
}
