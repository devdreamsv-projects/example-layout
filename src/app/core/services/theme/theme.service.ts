import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { ThemeColorKey } from './types/theme-color-key';
import { THEME_COLOR_STORAGE_KEY, THEME_MODE_STORAGE_KEY } from './constants/storage-key';

type ThemeMode = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {
	private readonly _doc = inject(DOCUMENT);
	private readonly _activeKey = signal<ThemeColorKey>((localStorage.getItem(THEME_COLOR_STORAGE_KEY) as ThemeColorKey | null) || ThemeColorKey.BLUE);

	private readonly _mode = signal<ThemeMode>('light');
	readonly isDarkMode = computed(() => this._mode() === 'dark');

	constructor(){
		effect(() => {
			const key = this._activeKey();
			const root = this._doc.documentElement;
			root.style.setProperty('--color-primary', `var(--color-${key})`);
			root.style.setProperty('--color-primary-light', `var(--color-${key}-light)`);
			localStorage.setItem(THEME_COLOR_STORAGE_KEY, key);
		})
	}

	init(): void {
		const saved = this.readStoredMode();
		const systemPreferDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
		const initialMode: ThemeMode = saved ?? (systemPreferDark ? 'dark' : 'light');
		
		this._mode.set(initialMode);
		this.applyMode(initialMode, false);
	}

	setColor(key: ThemeColorKey): void {
		this._activeKey.set(key);
	}

	getColor(): ThemeColorKey {
		return this._activeKey();
	}

	setMode(mode: ThemeMode): void {
		this._mode.set(mode);
		localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
		this.applyMode(mode, true);
	}

	toggleMode(originX: number, originY: number): void {
		const next: ThemeMode = this.isDarkMode() ? 'light' : 'dark';
		this.animateTransition(originX, originY, next);
	}

	private applyMode(mode: ThemeMode, animate: boolean): void {
		const root = this._doc.documentElement;
    
		if (animate) {
			root.style.opacity = '0.95';
			setTimeout(() => {
				root.classList.toggle('dark', mode === 'dark');
				root.style.colorScheme = mode;
				root.style.opacity = '1';
			}, 50);
		} else {
			root.classList.toggle('dark', mode === 'dark');
			root.style.colorScheme = mode;
		}
	}

	private readStoredMode(): ThemeMode | null {
		const value = localStorage.getItem(THEME_MODE_STORAGE_KEY);
		return value === 'light' || value === 'dark' ? value : null;
	}

	private animateTransition(x: number, y: number, mode: ThemeMode): void {
    const root = this._doc.documentElement;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const supportsViewTransitions = 'startViewTransition' in this._doc;

    if (!supportsViewTransitions || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._mode.set(mode);
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      this.applyMode(mode, true);
      return;
    }

    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${maxRadius}px`);

    
    this._doc.startViewTransition(() => {
      this._mode.set(mode);
      localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      this.applyMode(mode, true);
    });
  }
    
}