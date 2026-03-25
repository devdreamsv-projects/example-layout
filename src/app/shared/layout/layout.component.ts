import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ThemeService } from '@core/index';

@Component({
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	selector: 'layout-component',
	templateUrl: 'layout.component.html',
	styleUrls: ['layout.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
	private readonly themeService = inject(ThemeService);

	readonly isDarkMode = this.themeService.isDarkMode;

	toggleDarkMode(event: Event): void {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = rect.left + 22;
		const y = rect.top;
		this.themeService.toggleMode(x, y);
	}
}