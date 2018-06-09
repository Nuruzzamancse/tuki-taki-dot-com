import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {SearchService} from "../../services/search-service.service";
import {AuthService} from "../../services/auth.service";
import {ToasterServiceService} from "../../services/toaster.service";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products : any = [];

  bad = "";

  isAdmin:any;


  results: Object;
  searchTerm$ = new Subject<string>();


  constructor(
    private productService: ProductService,
    private router: Router,
    private searchService: SearchService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private toasterService: ToasterServiceService,

  ) {
    this.products = [];
    if(localStorage.getItem('isAdmin')=="true")
      this.isAdmin =1;
    console.log(this.isAdmin);



    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        console.log(results.data);

        this.results = results.data;
      });
  }

  ngOnInit() {
    this.productService.getProduct()
      .subscribe( response =>{
        this.products = response.data;
        console.log(this.products);
      })
  }

  cart(cnt,productId,product){
    this.productService.storeUserDatta(cnt,productId,product);

  }

  detailsView(id){
    this.router.navigate([`/details/${id}`])

  }

  editProduct(id){
    this.router.navigate([`/edit/${id}`])
  }

  // deleteProduct(product){
  //   console.log('delete working');
  //   this.productService.deleteProduct(product._id).subscribe(resoponse=>{
  //     console.log(resoponse);
  //     let productIndex = this.products.indexOf(product);
  //     let myProducts = this.products;
  //     myProducts.slice(productIndex, 1);
  //     this.products = myProducts;
  //   });
  //   // this.router.navigate(['/']);
  // }

  delFunc(prod){
    var r = confirm("Are you sure!");
    if (r == true) {
      this.products.splice(this.products.indexOf(prod), 1);
      this.productService.deleteProduct(prod._id).subscribe(respnse=>{
        this.toasterService.Info("Product has been deleted!!");
      });
    } else {
      this.toasterService.Warning("You have cancelled deletion!!");
    }

  }

  onLogoutClick(){

    this.authService.logout();

    // this.flashMessage.show('Your are successfully logged out!', {cssClass: 'alert-success'});

    this.toasterService.Success("You have successfullu logged out!!");

    this.router.navigate(['/login']);
    return false;

  }

}
