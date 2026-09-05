import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SiteLogo } from "../site-logo/site-logo";
import { Icon } from "../icon/icon";
import { User } from '../../../types/types.type';
import { UserData } from '../../../services/user-data';

@Component({
  imports: [SiteLogo, Icon],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  isSearchOpen = false;
  searchTerm = '';

  constructor(private router: Router, private readonly users: UserData) { }
  currentUser = signal<User | undefined>(undefined);
  ngOnInit(): void {
    let m_currentUserId = localStorage.getItem('currentUserId') ?? 'user-(-1)';
    if (m_currentUserId !== 'user-(-1)') {
      this.currentUser.set(this.users
        .getUsers()
        .find((item) => item.id === m_currentUserId));
    }
  }

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

  OpenAccount() {
    window.open(this.currentUser() ? '/account' : '/login', 'self');
  }
}

