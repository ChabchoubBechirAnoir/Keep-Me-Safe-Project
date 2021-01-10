import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { AuthConstants } from '../../config/auth-constants'
@Injectable({
providedIn: 'root'
})
export class AuthService {
constructor(
private httpService: HttpService,
private storageService: StorageService,
private router: Router
) {}

base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}


login(postData: any): Observable<any> {
return this.httpService.post('users/login', postData);
}

signup(postData: any): Observable<any> {
return this.httpService.post('users/register', postData);
}

preSignIn(clientId : any, codeChallenge : any): Observable<any> {
    let data = {
        clientId: clientId,
        codeChallenge: codeChallenge
    };
    return this.httpService.post('users/authorize', data);
    }
    
postSignIn(authorizationCode : any, codeVerifier : any, username : any): Observable<any> {
    let data = {
        authorizationCode: authorizationCode,
        codeVerifier: codeVerifier,
        username : username
    };
    return this.httpService.post('users/oauth/token', data);
    }
logout() {
this.storageService.removeStorageItem(AuthConstants.AUTH).then(res => {
this.router.navigate(['/login']);
});
}
getUserByUsername(username: any): Observable<any> {
    let data = {
        username : username
    };
    return this.httpService.post('users/profile',data);
}
processSign(postData: any){
    }
}