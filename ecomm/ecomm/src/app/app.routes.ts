import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SellerAuth } from './seller/seller-auth/seller-auth';
import { Sellerhome } from './seller/sellerhome/sellerhome';
import { sellerAuthGuardGuard } from './seller/guards/seller-auth-guard-guard';
import { AddProduct } from './seller/add-product/add-product';
import { Update } from './seller/update/update';
import { Searchbar } from './searchbar/searchbar';
import { ProductDetail } from './product-detail/product-detail';
import { UserAuth } from './user-auth/user-auth';
import { CartPage } from './cart-page/cart-page';
import { Checkout } from './checkout/checkout';

export const routes: Routes = [
    {   path:'', 
        component:Home
    },
    {
        path:'search/:id',
        component:Searchbar
    },
    {
        path:'detail/:productId',
        component:ProductDetail
    },
    {
        path:'user-auth',
        component:UserAuth
    },
    {
        path:'cart-page',
        component:CartPage
    },
    {
        path:'checkout',
        component:Checkout
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
