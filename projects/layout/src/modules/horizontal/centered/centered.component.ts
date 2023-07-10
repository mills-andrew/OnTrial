import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaWatcherService } from '@ngx-ontrial/core';
import { INavigation } from '../../../common/';
import { NavigationEntityService } from '../../../common/navigation-entity.service';
import { VerticalNavigationComponent } from '../../../components/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'centered-layout',
	templateUrl: './centered.component.html',
	encapsulation: ViewEncapsulation.None,
	// imports: [LoadingBarComponent, NgIf, VerticalNavigationComponent, HorizontalNavigationComponent, MatButtonModule, MatIconModule, RouterOutlet],
})
export class CenteredLayoutComponent implements OnInit, OnDestroy {
	navigation!: INavigation;
	isScreenSmall!: boolean;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		@Inject(ActivatedRoute) private _activatedRoute: ActivatedRoute,
		@Inject(Router) private _router: Router,
		private _navigationService: NavigationEntityService,
		private _MediaWatcherService: MediaWatcherService,
		private _ontrialNavigationService: NavigationEntityService,
	) {
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for current year
	 */
	get currentYear(): number {
		return new Date().getFullYear();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Subscribe to navigation data
		// this._navigationService.navigation$
		// 	.pipe(takeUntil(this._unsubscribeAll))
		// 	.subscribe((navigation: Navigation<NavigationItem>) => {
		// 		this.navigation = navigation;
		// 	});

		// Subscribe to media changes
		this._MediaWatcherService.onMediaChange$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(({ matchingAliases }) => {
				// Check if the screen is small
				this.isScreenSmall = !matchingAliases.includes('md');
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Toggle navigation
	 *
	 * @param name
	 */
	toggleNavigation(name: string): void {
		// Get the navigation
		const navigation = this._ontrialNavigationService.getComponent<VerticalNavigationComponent>(name);

		if (navigation) {
			// Toggle the opened status
			navigation.toggle();
		}
	}
}
