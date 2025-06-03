import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Router }        from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule }  from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirm  = '';
  error    = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    if (this.password !== this.confirm) {
      this.error = "Passwords don't match";
      return;
    }

    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        // Registration succeeded → go to login
        console.log('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
