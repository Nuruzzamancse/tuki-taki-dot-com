import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { NgForm } from '@angular/forms';
import { StripeService} from "../../common/stripe.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {FlashMessagesService} from "angular2-flash-messages";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  arrObj:string[] = new Array(0);

  myProductArray : any [];

  productList: any[];

  sum : any;

  name: any;

  phone: any;

  deliveryAddress: any;

  constructor(
    private cd: ChangeDetectorRef,
    private stripeService: StripeService,
    private authServie: AuthService,
    private router: Router,
    private productService: ProductService,
    private flashMessage: FlashMessagesService,

  ) {
    this.sum = 0;
    console.log(this.name);
    console.log(this.phone);
    console.log(this.deliveryAddress);
  }

  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  email: any;






  ngOnInit() {
    this.myProductArray = JSON.parse(localStorage.getItem('myProductCart'));

    console.log('In checkout myProductCart');

    //console.log(localStorage.getItem('myProductCart'));


    this.productService.getProduct()
      .subscribe(respnse=>{
        this.productList = respnse.data;
        //console.log(this.productList);
      })

    if(this.myProductArray)
    for(let i=0;i<this.myProductArray.length;i++) {
      // this.sum = this.sum + parseInt(this.myProductArray[i].myProduct.price) * parseInt(this.myProductArray[i].myProductCount);
      this.arrObj.push(this.myProductArray[i].myProduct._id);

      this.sum = this.sum + this.myProductArray[i].myProduct.price * this.myProductArray[i].myProductCount;

      console.log('Sum = '+this.sum);
    }

    console.log('Sum2 = '+this.sum);

  }

  home(){
    this.router.navigate(['/']);
  }

  shop(){
    console.log('in shop');

    if(this.authServie.loggedIn()) {
      //
      // //this.router.navigate(['/checkout'])
      // let User = {
      //   buyList: this.arrObj,
      //   wishList: null
      // }
      //
      //
      // if(this.myProductArray)
      //   for(let i=0;i<this.myProductArray.length;i++) {
      //     // this.sum = this.sum + parseInt(this.myProductArray[i].myProduct.price) * parseInt(this.myProductArray[i].myProductCount);
      //     //this.arrObj.push(this.myProductArray[i].myProduct._id);
      //
      //     //console.log('Checking product :' + JSON.stringify(this.myProductArray[i].myProduct));
      //
      //     for(let j=0; j<this.productList.length;j++){
      //       if(this.productList[j]._id==this.myProductArray[i].myProduct._id){
      //         this.productList[j].avl = this.productList[j].avl - this.myProductArray[i].myProductCount;
      //         //console.log(this.productList[j].avl);
      //         // this.productService.updateProduct(this.productList[j]._id,this.productList[j].product);
      //
      //         this.productService.updateProduct(this.productList[j]._id,this.productList[j])
      //           .subscribe(response=>{
      //            // console.log(response)
      //           })
      //         // this.router.navigate(['/']);
      //
      //
      //       }
      //     }
      //   }
      //
      // localStorage.setItem('myProductCart',null);
      //
      //
      // localStorage.setItem('myProductCart',null);
      // localStorage.setItem('cnt',JSON.stringify(0));
      //
      //
      // this.authServie.UpdateProfile(localStorage.getItem('loginId'),User)
      //   .subscribe(response=>{
      //     //console.log('Here in update bal');
      //     console.log(response.data.name);
      //     console.log('Buy List' +response.data.buyList);
      //     console.log('Wish List' +response.data.wishList);
      //
      //   });

    }
    else
      this.router.navigate(['/login']);

  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      //console.log('Success!', token);
      this.stripeService.confirmPayment(this.email, token, this.sum)
        .subscribe((response) => {

          if(response.success){

            this.flashMessage.show('You have bought suuccessfully.Thank You!', { cssClass: 'alert-success' })
            //this.router.navigate(['/checkout'])
            let User = {
              buyList: this.arrObj,
              wishList: null
            }


            if(this.myProductArray)
              for(let i=0;i<this.myProductArray.length;i++) {
                // this.sum = this.sum + parseInt(this.myProductArray[i].myProduct.price) * parseInt(this.myProductArray[i].myProductCount);
                //this.arrObj.push(this.myProductArray[i].myProduct._id);

                //console.log('Checking product :' + JSON.stringify(this.myProductArray[i].myProduct));

                for(let j=0; j<this.productList.length;j++){
                  if(this.productList[j]._id==this.myProductArray[i].myProduct._id){
                    this.productList[j].avl = this.productList[j].avl - this.myProductArray[i].myProductCount;
                    //console.log(this.productList[j].avl);
                    // this.productService.updateProduct(this.productList[j]._id,this.productList[j].product);

                    this.productService.updateProduct(this.productList[j]._id,this.productList[j])
                      .subscribe(response=>{
                        // console.log(response)
                      })
                    // this.router.navigate(['/']);


                  }
                }
              }

            localStorage.setItem('myProductCart',null);


            localStorage.setItem('myProductCart',null);
            localStorage.setItem('cnt',JSON.stringify(0));


            this.authServie.UpdateProfile(localStorage.getItem('loginId'),User)
              .subscribe(response=>{
                //console.log('Here in update bal');
                console.log(response.data.name);
                console.log('Buy List' +response.data.buyList);
                console.log('Wish List' +response.data.wishList);

                this.router.navigate(['/']);
              });

          }
          else{
            this.flashMessage.show('Sorry. Try again', { cssClass: 'alert-danger' })

          }


        });
      // ...send the token to the your backend to process the charge
    }
  }
}


