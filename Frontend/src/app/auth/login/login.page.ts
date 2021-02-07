import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';

@Component({
selector: 'app-login',
templateUrl: './login.page.html',
styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
postData = {
username: '',
password: '',
SignInId : ''
};
clientId = crypto.getRandomValues(new Uint32Array(1))[0];
codeVerifier = crypto.getRandomValues(new Uint32Array(10))[0].toString();
codeChallenge = sha256(this.codeVerifier);
authorizationCode = ''
constructor(
private router: Router,
private authService: AuthService,
private storageService: StorageService
) {}

ngOnInit() {
  this.authService.preSignIn(this.clientId, this.codeChallenge).subscribe(
    (res: any) => {
      console.log(this.codeVerifier);
      this.postData.SignInId = res.SignInId;
    }
  );
}

validateInputs() {
let username = this.postData.username.trim();
let password = this.postData.password.trim();
return (
this.postData.username &&
this.postData.password &&
username.length > 0 &&
password.length > 0
);
}

loginAction() {
if (this.validateInputs()) {
this.authService.login(this.postData).subscribe(
(res: any) => {
if (res.authorizationCode) {
this.authorizationCode = res.authorizationCode
console.log(this.postData.username)
this.authService.postSignIn(this.authorizationCode, this.codeVerifier, this.postData.username).subscribe(
  (res: any) => {
  if (res.token) {
  // Storing the User data.
  this.storageService.store(AuthConstants.AUTH, res.token);
  this.router.navigate(['tab1']);
  }
  },
  (error: any) => {
  console.log('Network Issue.');
  }
  );
}
},
(error: any) => {
console.log('Network Issue.');
}
);

} 
}
}