import { Component,inject,OnInit,PLATFORM_ID,signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'ec-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{
  headerType = signal<'default' | 'seller'>('default')
  sellerName:string = 'Profile';
  router = inject(Router);

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
  }
  logout(){
    localStorage.removeItem('seller');
    this.router.navigate(['']);
  }
}
