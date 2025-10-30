import { Component,inject,OnInit } from '@angular/core';
import { UserCart } from '../services/user-cart';
import { orderData } from '../interfaces/sellerAuth-interface';

@Component({
  selector: 'ec-myorders',
  imports: [],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css'
})
export class Myorders implements OnInit{
  userCartServ = inject(UserCart);
  orderData : orderData[] = [];

  constructor(){}

  ngOnInit(): void {
   this.getOrderList()
  }

  cancelOrder(id:string){
   id && this.userCartServ.cancelOrder(id).subscribe(
      (response)=>{
        this.getOrderList()
      }
    )
  }

  getOrderList(){
       this.userCartServ.getOrderData().subscribe(
        (data)=>{
          this.orderData = data;
        }
      )
  }

}
