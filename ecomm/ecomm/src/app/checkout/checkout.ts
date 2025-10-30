import { Component,inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'ec-checkout',
  imports: [ReactiveFormsModule,
            FormsModule,
            MatInputModule,
            MatInput,
            MatFormFieldModule,
            MatExpansionModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  checkoutForm!:FormGroup;
  fb  =  inject(FormBuilder)

  ngOnInit(): void {
      this.checkoutForm = this.fb.group({
        email : [],
        phone:[],
        address:this.fb.group({
          line1:[],
          city:[],
          state:[],
          pincode:[]
        })
      })
  }
}
