import { Component } from '@angular/core';
import { StorageService } from './../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from './../services/auth.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
payload;
profiledata;
  constructor(
private storageService: StorageService,
private authService : AuthService
  ) {}
  ngOnInit() {
    this.storageService.get(AuthConstants.AUTH).then(data => {
      this.payload = data;
      this.authService.getUserByUsername(data['sub']).subscribe(
        (res: any) => {
          this.profiledata = res[0]
          console.log(this.profiledata);
        }
      );
    
    });
  }
  logout(){
    this.authService.logout();
  }
}
