import { Component, OnInit,signal,inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'ec-update',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './update.html',
  styleUrl: './update.css'
})
export class Update implements OnInit{
  updateForm!:FormGroup;
  productUpdated = signal(false);
  router = inject(Router)
  constructor(private fb:FormBuilder){}

  ngOnInit(): void {
      this.updateForm = this.fb.group({
        name:['',Validators.required],
        price:['',Validators.required],
        category:['',Validators.required],
        color:['',Validators.required],
        imageUrl:['',Validators.required],
        description:['',Validators.required],
      })
  }
  updateProduct(){
    console.log(this.updateForm.value)
      this.productUpdated.set(true)
      setTimeout(() => {
        this.productUpdated.set(false)
        this.router.navigate(['seller-home']);
      },2000);
      
  }
}
