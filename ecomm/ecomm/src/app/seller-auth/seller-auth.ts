import { Component,OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { passwordMatcherValidator } from './passwordMatcherValidator';
import { Seller } from '../services/seller';
@Component({
  selector: 'ec-seller-auth',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,FormsModule],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css'
})
export class SellerAuth implements OnInit{
  signUpForm!:FormGroup;
constructor(private fb:FormBuilder,
            private sellerService:Seller
){}
ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name:['', Validators.required],
      email: ['',Validators.email],
      password: ['',Validators.required],
      repeatPassword:[''],
    },{
      validators:passwordMatcherValidator
    });
}
  sellerSignUp(){
    console.log(this.signUpForm.value);
    this.sellerService.signUp(this.signUpForm.value).subscribe((result)=>{
      console.log(result);
    });
  }
  
}
