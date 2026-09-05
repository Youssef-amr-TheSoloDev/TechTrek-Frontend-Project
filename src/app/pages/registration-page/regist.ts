
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserData } from '../../../services/user-data';
import { User } from '../../../types/types.type';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';

  constructor(
    private userData: UserData,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const users = this.userData.USERS;

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === this.email.trim().toLowerCase()
    );

    if (existingUser) {
      this.errorMessage = 'This email is already registered.';
      return;
    }

    const newUser: User = {
      id: `user-${String(users.length + 1).padStart(3, '0')}`,
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        borrowedCount: 0,
        purchasedCount: 0,
        dueSoonCount: 0,
        overdueCount: 0
      },
      borrows: [],
      purchases: [],
      activities: [],
      sessions: []
    };

    users.push(newUser);

    localStorage.setItem('currentUserId', newUser.id);

    this.router.navigate(['/account']);
  }
}

