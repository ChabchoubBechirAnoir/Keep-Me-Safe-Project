import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
password: ''
};

constructor(
private router: Router,
private authService: AuthService,
private storageService: StorageService,
private toaster:ToastService) {}

ngOnInit() {}

validateInputs() {
  let username = this.postData.username.trim();
  let password = this.postData.password.trim();
  console.log(username);
  console.log(password);
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
      console.log(res);
    if (res.token) {
    // Storing the User data.
      this.storageService.store(AuthConstants.AUTH, res.token);
      this.router.navigate(['tabs/tab1']); 
      this.toaster.presentToast('Login successful')
    } 
    else {
      this.toaster.presentToast('incorrect password.')
      console.log('incorrect password.');
    }
  },
    (error: any) => {
    this.toaster.presentToast('Invalid credentials.')
    console.log('Invalid credentials.');
    }
    );
  } 
  //Missing data in registration
  else {
  console.log('Please enter email,username and password.');
  }
}
}