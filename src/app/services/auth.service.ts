import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FAKE_DATA } from '../data/data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users: any[] = FAKE_DATA;

  constructor() { }

  login(email: string, password: string) {
    if (this.users.some(el => el.email == email) && password?.length >= 3) {
      localStorage.setItem('token', window.btoa(email));
      return of(true);
    } else {
      return of(false);
    }
  }

  userData() {
    return localStorage.getItem('token') && this.users.find(el => el.email == window.atob(localStorage.getItem('token') as string));
  }

  logout() {
    localStorage.removeItem('token');
    return of(true);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
