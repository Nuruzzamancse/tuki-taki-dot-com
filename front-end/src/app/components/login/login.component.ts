import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {ProductService} from "../../services/product.service";
import { ToasterServiceService} from "../../services/toaster.service";
import { Location} from "@angular/common";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email : String;
  password: string;


  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private productService: ProductService,
    private toasterService: ToasterServiceService,
    private location: Location
  ) { }

  ngOnInit() {



  }


  onLoginSubmit(){

    const user ={
      email: this.email,
      password: this.password
    }


    this.authService.authenticateUser(user).subscribe(res =>{

      //console.log(user.email);


      if(res.success){

        // console.log(res.data.isAdmin);

        localStorage.setItem('isAdmin',res.data.isAdmin);
        localStorage.setItem('loginId',res.data._id);

        this.authService.storeUserDatta(res.token, res.data);


        // this.location.back();

        this.toasterService.Success("Successfully Logged in!!");

        this.router.navigate(['/']);
      }
      else if (!res.success){
        // this.flashMessage.show('Something went wrong !', { cssClass: 'alert-danger' } );
        this.toasterService.Warning(res.message);

        console.log(res.message);

        this.router.navigate(['/login']);
      }
    })

  }

}
