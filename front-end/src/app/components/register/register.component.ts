import { Component, OnInit } from '@angular/core';
import { ValidateService} from "../../services/validate.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { AuthService} from "../../services/auth.service";
import { Router} from "@angular/router";
import { ToasterServiceService} from "../../services/toaster.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  email: String ;
  username: String;
  password: String;
  wishList: [String];
  buyList: [String];


  constructor(
              private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router,
              private toasterService: ToasterServiceService
  ) { }

  ngOnInit() {

  }

  onRegisterSubmit(){
    const user = {
      name : this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      wishList: this.wishList,
      buyList: this.buyList
    }

    //Required Fiels
    if(!this.validateService.validateRegister(user)){
      // this.flashMessages.show('Please fill in all fields',{cssClass: 'alert-danger',timeout:300});
      // this.flashMessage.warning('Please fill in all fields',{delay:2000});
      // this._flashMessagesService.show('Please fill in all fields!', { cssClass: 'alert-danger' } );

      this.toasterService.Warning("Please fill in all fields");
      return false;
    }

    //Validate Email
    if(!this.validateService.validateEmail(user.email)){
      // this.flashMessages.show('Please use a valid email',{cssClass: 'alert-danger',timeout:300});

      // this._flashMessagesService.show('Please use valid Email!', { cssClass: 'alert-danger' } );
      this.toasterService.Warning("Please use valid Email!");
      return false;
    }

    this.authService.registerUser(user)
      .subscribe( data =>{
        if(data.success) {
          // this._flashMessagesService.show('You are now Registered.', {cssClass: 'alert-success'});
          this.toasterService.Info("You are now Registered.");
          this.router.navigate(['/login']);
        }
        else {
          // this._flashMessagesService.show('Something went wrong', { cssClass: 'alert-danger'});
          this.toasterService.Error("Something went wrong please try again!");
          this.router.navigate(['/register']);
        }
      })
  }

}
