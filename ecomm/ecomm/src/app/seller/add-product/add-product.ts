import { Component,inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'ec-add-product',
  imports: [FormsModule, MatFormFieldModule, MatInputModule,ReactiveFormsModule,JsonPipe],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {

  fb:FormBuilder = inject(FormBuilder);
  sellerAddProductForm!:FormGroup;
  constructor(){}

  ngOnInit(): void {
      this.sellerAddProductForm = this.fb.group({
        name:['',Validators.required],
        price:['',Validators.required],
        category:['',Validators.required],
        color:['',Validators.required],
        imageUrl:['',Validators.required],
        description:['',Validators.required],
      })
  }
  addProduct(){
    console.log(this.sellerAddProductForm.value);
  }
}
