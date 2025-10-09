import { Component,OnInit,inject } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { passwordMatcherValidator } from './passwordMatcherValidator';
import { Seller } from '../../services/seller';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'ec-seller-auth',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,FormsModule,JsonPipe],
  templateUrl: './seller-auth.html',
  styleUrl: './seller-auth.css'
})
export class SellerAuth implements OnInit{
  signUpForm!:FormGroup;
  logInForm!:FormGroup;
  signUpVisible:boolean = true;
  logInVisible:boolean = false;
  router= inject(Router)
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
    this.logInForm = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
    })
    this.sellerService.isSellerReg();
  }
    sellerSignUp(){
    console.log(this.signUpForm.value);
    // this.sellerService.signUp(this.signUpForm.value).subscribe((result)=>{
    //   console.log(result)
    //   if(result){
    //     this.router.navigate(['/seller-home']);
    //   };
    // });
    // differet approach after applying canActivate Guard
    this.sellerService.signUp(this.signUpForm.value);
    }
    sellerLogIn(){
      console.log(this.logInForm.value);
    }
    showLogInForm(){
      this.signUpVisible = false;
      this.logInVisible = true;
    }
    showSignUpForm(){
      this.signUpVisible = true;
      this.logInVisible = false;
    }
  
}
