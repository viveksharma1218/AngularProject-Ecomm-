import { Component,inject,OnInit,signal } from '@angular/core';
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
         let seller = JSON.stringify(localStorage.getItem('seller'));
          if(seller && event.url.includes('seller')){
            //console.log('seller view can be initialized');
            this.headerType.set('seller');
          }
          else{
            //console.log('seller view cannot be initialized');
           this.headerType.set('default');
          }
        })
  }
}
