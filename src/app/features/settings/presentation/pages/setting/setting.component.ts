import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService, THEME_COLORS } from '@core/index';
import { ThemeColor } from '@core/services/theme/interfaces/theme-color';

@Component({
    imports: [],
    selector: 'app-setting',
    templateUrl: 'setting.component.html',
		styleUrls: ['setting.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingComponent {
	private readonly themeService = inject(ThemeService);

	readonly colors = THEME_COLORS;
	readonly activeColor = this.themeService.getColor();
	readonly isDarkMode = this.themeService.isDarkMode;

	changeColor(color: ThemeColor): void {
		this.themeService.setColor(color.key);
	}

	isChecked(color: ThemeColor): boolean {
		return this.activeColor === color.key;
	}

	getBorderColor(color: ThemeColor): string {
		return this.isChecked(color) ? color.hex : 'transparent';
	}

	getBoxShadow(color: ThemeColor): string {
		return this.isChecked(color) ? `0 0 0 3px ${color.hex}40` : 'none';
	}

	toggleDarkMode(event: Event): void {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		console.log(rect);
		const x = rect.left + 22;
		const y = rect.top;
		this.themeService.toggleMode(x, y);
	}
}