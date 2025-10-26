import { Component,inject,OnInit} from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup,FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  constructor(){}
  ngOnInit(): void {
      this.signUpForm = this.fb.group({
         name:[''],
      email: [''],
      password: [''],
      repeatPassword:[''],
      });
      this.logInForm = this.fb.group({
         email: [''],
        password: [''],
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
      
    }
    userLogIn(){
      console.log(this.logInForm.value);
      
    }
    showLogInForm(){
      this.usersignUpVisible = false;
      this.userlogInVisible = true;
    }
    showSignUpForm(){
      this.usersignUpVisible = true;
      this.userlogInVisible = false;
    }
}
