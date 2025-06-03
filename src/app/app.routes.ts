import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ShopItemsComponent } from './pages/shop-items/shop-items.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterPaymentComponent } from './pages/register-payment/register-payment.component';
import { UserPaymentsComponent }     from './pages/user-payments/user-payments.component';
import { EventManagementComponent }  from './pages/event-management/event-management.component';
import { AdminPaymentsComponent }    from './pages/admin-payments/admin-payments.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // or redirectTo: 'items'
  { path: 'items', component: ShopItemsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-payment', component: RegisterPaymentComponent },
  { path: 'my-payments/:eventId', component: UserPaymentsComponent },
  { path: 'admin/events',    component: EventManagementComponent },
  { path: 'admin/payments',  component: AdminPaymentsComponent },
 // { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }, // fallback to home
];


