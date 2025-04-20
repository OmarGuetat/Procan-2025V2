import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { AuthService } from './services/auth.service';


@Component({
    selector: 'app-root',
    template: '<router-outlet />',
    imports: [RouterOutlet],
    providers: [AuthService],
})
export class AppComponent implements OnInit {
  title = 'Procan';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);
  readonly #iconSetService = inject(IconSetService);

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.#router.events.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
