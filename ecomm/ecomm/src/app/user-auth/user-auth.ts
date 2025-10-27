import { Component,inject,OnInit} from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup,FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../services/user';
import { passwordMatcherValidator } from '../seller/seller-auth/passwordMatcherValidator';

@Component({
  selector: 'ec-user-auth',
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,FormsModule],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css'
})
export class UserAuth implements OnInit {
  signUpForm!:FormGroup;
  logInForm!:FormGroup;
  fb = inject(FormBuilder);
  usersignUpVisible:boolean = true;
  userlogInVisible:boolean = false;
  userServ = inject(User);
  invalidUser :boolean= false;
  constructor(){}
  ngOnInit(): void {
      this.userServ.isUser();
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
  }
    userSignUp(){
      console.log(this.signUpForm.value);
      // this.sellerService.signUp(this.signUpForm.value).subscribe((result)=>{
      //   console.log(result)
      //   if(result){
      //     this.router.navigate(['/seller-home']);
      //   };
      // });
      // differet approach after applying canActivate Guard
      this.userServ.userSignUp(this.signUpForm.value);
    }
    userLogIn(){
      //console.log(this.logInForm.value);
      this.userServ.userLogin(this.logInForm.value);
      //console.log(this.userServ.invalidUser);
      this.invalidUser = this.userServ.invalidUser;
    }
    showLogInForm(){
      this.usersignUpVisible = false;
      this.userlogInVisible = true;
    }
    showSignUpForm(){
      this.usersignUpVisible = true;
      this.userlogInVisible = false;
    }
    tryAgain(){
      this.invalidUser = false;
    }
}
