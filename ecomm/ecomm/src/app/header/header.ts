import { Component,inject,OnInit,OnChanges,signal, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { SellerAddProduct } from '../services/seller-add-product';
import {FormsModule } from '@angular/forms';
import { product } from '../interfaces/sellerAuth-interface';
import { LocationService,Location } from '../services/location';
import { WeatherService } from '../services/weather';
import { CommonModule } from '@angular/common';
import { ProductCat } from '../services/product-cat';
import { Allproduct } from '../services/allproduct';

@Component({
  selector: 'ec-header',
  imports: [RouterLink, FormsModule,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit ,OnChanges{
  searchValue :string = '';
  showSearchFilter:boolean = false;
  headerType = signal<'default' | 'seller'>('default')
  sellerName:string = 'Profile';
  allProducts: product[] | undefined;
  filterProducts: product[] | undefined = [];
  router = inject(Router);
  fullWeatherInfo = signal(false);
  secondHeader:boolean = false;
  grocery :string[] = [];
  fashion:string[] = [];
  home:string[] = [];
  beauty:string[] = [];
  health:string[]=[];
  sports:string[] =[];
  toys:string[] = [];
  books:string[]=[];
  baby:string[] =[];
  luxury:string[]=[];
  handmade:string[]=[];
    private locationService = inject(LocationService);
    private weatherService = inject(WeatherService);
    private productCat = inject(ProductCat);
    private AllproductServ = inject(Allproduct);
  
    location = signal<Location | null>(null);
    error = signal<string>('');
    isLoading = signal<boolean>(false);
  constructor(private productServ:SellerAddProduct){}

  ngOnInit(): void {
      //this.router.events.subscribe((events:any)=>{
        //below we accessed all events Objects
        //console.log(events);
        //we want url but below some events Objects have undefined Url
        //console.log(events.url);
         // })
        this.router.events.pipe(filter((event)=>{
          return event instanceof NavigationEnd
        })).subscribe((event:NavigationEnd)=>{
          //console.log('Current Navigation URL',event.url)
          //we are checking if seller is already registered or login and current page is seller page
         
          if(localStorage.getItem('seller') && event.url.includes('seller')){
            //console.log('seller view can be initialized');
            this.headerType.set('seller');
            let sellerData = localStorage.getItem('seller');
           let finalSellerObject: any;
          //there is three scenarios 1.data does not exist 2.data is Single Object 3. Data is an Array  
          if (sellerData) {
            // 2. Parse the JSON string.
            let parsedData = JSON.parse(sellerData);

            // 3. Check if the parsed data is an array.
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              // If it's an array, take the first object.
              finalSellerObject = parsedData[0];
            } else {
              // Otherwise, assume it's the single object.
              finalSellerObject = parsedData;
            }
          }
          // 4. Safely access the 'name' property using optional chaining.
          // This works whether finalSellerObject is an object or undefined.
          const sellerName = finalSellerObject?.name;
          this.sellerName = sellerName;
          //console.log(sellerName); // Outputs "Vivek" or undefined
 
          }
          else{
            //console.log('seller view cannot be initialized');
           this.headerType.set('default');
          }
        })
        this.getAllProducts();
        this.getLocationAndWeather();
        this.grocery = this.productCat.grocery;
        this.fashion=this.productCat.fashion;
        this.home=this.productCat.home;
        this.beauty = this.productCat.beauty;
        this.health=this.productCat.health;
        this.sports=this.productCat.sports;
        this.toys=this.productCat.toys;
        this.books=this.productCat.books;
        this.baby=this.productCat.baby;
        this.luxury=this.productCat.luxury;
        this.handmade=this.productCat.handmade;
        this.allProducts = this.AllproductServ.products;
       
  }
  ngOnChanges(changes: SimpleChanges): void {
      
  }
  logout(){
    localStorage.removeItem('seller');
    this.router.navigate(['']);
  }
  searchFilter(query:KeyboardEvent){
    let element = query.target as HTMLInputElement;
    this.searchValue = element.value;
    //console.log(this.searchValue);
    this.getfilterProducts();
    //console.log(this.filterProducts)
  }
  getAllProducts(){
    this.productServ.productList().subscribe((data)=>{
      //this.allProducts = data;
      this.AllproductServ.products = data;
    })
  }
  getfilterProducts(){
     if (!this.allProducts || this.allProducts.length === 0) {
      this.filterProducts = [];
      return;
    }

    if (!this.searchValue?.trim()) {
      this.filterProducts = this.allProducts.slice(0, 5);
      return;
    }

    const lowerCaseQuery = this.searchValue.toLowerCase().trim();
    
    this.filterProducts = this.allProducts.filter((product) => {
      return (
        product.name?.toLowerCase().includes(lowerCaseQuery) ||
        product.color?.toLowerCase().includes(lowerCaseQuery) ||
        product.category?.toLowerCase().includes(lowerCaseQuery) ||
        product.description?.toLowerCase().includes(lowerCaseQuery)
      );
    }).slice(0, 5);
  }

    showFullWeatherinfo(){
      this.fullWeatherInfo.set(true);
    }
    hideFullWeatherinfo(){
      this.fullWeatherInfo.set(false);
    }

    async getLocationAndWeather() {
    this.isLoading.set(true);
    this.error.set('');
    this.location.set(null);

    this.locationService.getLocationWithWeather().subscribe({
      next: (location) => {
        this.location.set(location);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error);
        this.isLoading.set(false);
      }
    });
  }

  refreshWeather() {
    if (this.location()) {
      this.getLocationAndWeather();
    }
  }

  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getGoogleMapsLink(): string {
    if (!this.location()) return '';
    return `https://www.google.com/maps?q=${this.location()!.latitude},${this.location()!.longitude}`;
  }
  getSearchResult(val:any){
      // console.log(val);
      this.router.navigate([`search/${val}`])
  }
  onFocus(){
    this.showSearchFilter = true
  }
  onBlur(){
    this.showSearchFilter = false;
  }
  showSecondHeader(){
    this.secondHeader = !this.secondHeader;
  }
}
