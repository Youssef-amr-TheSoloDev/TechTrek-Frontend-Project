
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserData } from '../../../services/user-data';
import { User } from '../../../types/types.type';

@Component({
  selector: 'app-account-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class AccountPreview implements OnInit {
  user: User | undefined;

  constructor(
    private userData: UserData,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('currentUserId');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.userData
      .getUsers()
      .find((item) => item.id === userId);

    if (!this.user) {
      localStorage.removeItem('currentUserId');
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUserId');
    this.router.navigate(['/login']);
  }
}

