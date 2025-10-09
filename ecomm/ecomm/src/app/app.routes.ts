import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller/seller-auth/seller-auth';
import { Sellerhome } from './seller/sellerhome/sellerhome';

export const routes: Routes = [
    {path:'', component:Home},
    {path:'seller-auth', component:SellerAuth},
    {path:'seller-home',component:Sellerhome}
];
