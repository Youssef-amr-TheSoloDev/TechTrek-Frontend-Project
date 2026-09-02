import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../../components/icon/icon';

@Component({
  imports: [FormsModule, RouterLink, Icon],
  selector: 'app-page404',
  styleUrl: './page404.css',
  templateUrl: './page404.html',
})
export class Page404 {
  searchTerm = '';

  constructor(private router: Router) { }

  submitSearch(event: Event): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement | null;
    const input = form?.elements.namedItem('searchTerm') as HTMLInputElement | null;
    const term = (input?.value ?? this.searchTerm).trim();
    if (!term) {
      return;
    }

    this.router.navigate(['/explore', 'search', encodeURIComponent(term)]);
    this.searchTerm = '';
  }
}
