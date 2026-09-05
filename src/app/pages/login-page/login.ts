
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserData } from '../../../services/user-data';
import { User } from '../../../types/types.type';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private userData: UserData,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    const users: User[] = this.userData.getUsers();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === this.email.trim().toLowerCase() &&
        item.password === this.password
    );

    if (!user) {
      this.errorMessage = 'Invalid email or password.';
      return;
    }

    localStorage.setItem('currentUserId', user.id);

    this.successMessage = `Welcome back, ${user.name}!`;

    setTimeout(() => {
      this.router.navigate(['/account']);
    }, 500);
  }
}

