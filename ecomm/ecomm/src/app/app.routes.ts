import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller/seller-auth/seller-auth';
import { Sellerhome } from './seller/sellerhome/sellerhome';
import { sellerAuthGuardGuard } from './seller/guards/seller-auth-guard-guard';
import { AddProduct } from './seller/add-product/add-product';
import { Update } from './seller/update/update';

export const routes: Routes = [
    {   path:'', 
        component:Home
    },
    //paths for seller must have name 'seller' because we are 
    // using this for dynamic header
    {   path:'seller-auth', 
        component:SellerAuth
    },
    {   path:'seller-home',
        component:Sellerhome,
        canActivate:[sellerAuthGuardGuard]
    },
    {   path:'seller-add-product',
        component:AddProduct,
        canActivate:[sellerAuthGuardGuard]
    },
    {
        path:'seller-update-product/:id',
        component:Update,
        canActivate:[sellerAuthGuardGuard]
    },
    {   path:'**',
        component:Home
    }
];
