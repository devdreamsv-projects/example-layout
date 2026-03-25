import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./features').then(m => m.HomeComponent)
            },
            {
                path: 'tasks',
                loadComponent: () => import('./features').then(m => m.TaskListComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features').then(m => m.SettingComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
