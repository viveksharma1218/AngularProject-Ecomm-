import { Component,inject,OnInit,signal } from '@angular/core';
import { UserCart } from '../services/user-cart';
import { orderData } from '../interfaces/sellerAuth-interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ec-myorders',
  imports: [],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css'
})
export class Myorders implements OnInit{
  userCartServ = inject(UserCart);
  orderData = signal<orderData[]>([]);

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
       this.userCartServ.getOrderData().subscribe({
        next: (response)=>{
          if(response && response.body){
            this.orderData.set(response.body);
          }
          else{
            this.orderData.set([]);
          }
        },
        error:(error)=>{
          this.orderData.set([]);
        }
       })
  }
}
