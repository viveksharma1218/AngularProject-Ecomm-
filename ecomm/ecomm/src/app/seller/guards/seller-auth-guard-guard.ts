import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Seller } from '../../services/seller';

export const sellerAuthGuardGuard: CanActivateFn = (route, state) => {
  const sellerService = inject(Seller);
  return sellerService.isSellerLoggedin;
};
