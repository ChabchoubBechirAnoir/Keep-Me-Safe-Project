import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../../config/auth-constants';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';

@Component({
selector: 'app-signup',
templateUrl: './signup.page.html',
styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
postData = {
surname: '', 
forename: '',
location: '',
username: '',
email: '',
password: ''
};

constructor(
private authService: AuthService,
private toastService: ToastService,
private storageService: StorageService,
private router: Router
) {}

ngOnInit() {}

validateInputs() {
let surname = this.postData.surname.trim();
let forename = this.postData.forename.trim();
let location = this.postData.location.trim();
let username = this.postData.password.trim();
let password = this.postData.password.trim();
let email = this.postData.email.trim();
console.log(this.postData);
return (
this.postData.username &&
this.postData.password &&
this.postData.email &&
this.postData.forename &&
this.postData.surname &&
this.postData.location &&
username.length > 0 &&
email.length > 0 &&
password.length > 0
);
}

signAction() {
if (this.validateInputs()) {
this.authService.signup(this.postData).subscribe(
(res: any) => {
// Storing the User data.
this.storageService
.store(AuthConstants.AUTH, res.userData)
.then(res => {
this.router.navigate(['tabs/tab2']);
});
} 
,
(error: any) => {
this.toastService.presentToast('Network Issue.');
}
);
} else {
this.toastService.presentToast(
'Please enter email, username or password.'
);
}
}
}