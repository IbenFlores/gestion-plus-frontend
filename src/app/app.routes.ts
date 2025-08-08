import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
    { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [authGuard] },
    
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    { path: '**', redirectTo: '/login' }
];