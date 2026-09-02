import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SiteLogo } from "../site-logo/site-logo";
import { Icon } from "../icon/icon";

@Component({
  imports: [SiteLogo, Icon],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  isSearchOpen = false;
  searchTerm = '';

  constructor(private router: Router) { }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;

    if (this.isSearchOpen) {
      setTimeout(() => {
        const input = document.getElementById('navbar-search') as HTMLInputElement | null;
        input?.focus();
      });
      return;
    }

    this.searchTerm = '';
  }

  submitSearch(event?: Event): void {
    event?.preventDefault();

    const term = this.searchTerm.trim();
    if (!term) {
      return;
    }

    this.router.navigate(['/explore', 'search', encodeURIComponent(term)]);
    this.isSearchOpen = false;
    this.searchTerm = '';
  }
}

