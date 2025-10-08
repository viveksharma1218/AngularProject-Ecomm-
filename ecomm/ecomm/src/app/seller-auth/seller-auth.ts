import { Component,OnInit } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { passwordMatcherValidator } from './passwordMatcherValidator';
@Component({
  selector: 'ec-seller-auth',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,FormsModule,JsonPipe],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css'
})
export class SellerAuth implements OnInit{
  signUpForm!:FormGroup;
constructor(private fb:FormBuilder){}
ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name:['', Validators.required],
      password: ['',Validators.required],
      repeatPassword:[''],
      email: ['',Validators.email]
    },{
      validators:passwordMatcherValidator
    });
}
  sellerSignUp(){
    console.log(this.signUpForm.value);
  }
  
}
