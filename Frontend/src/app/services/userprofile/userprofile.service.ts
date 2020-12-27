import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

constructor(private httpService :HttpClient) { }

getprofile():Observable<any>{
  return this.httpService.get('urlget');
}

updateprofile(postData: any): Observable<any> {
  return this.httpService.post('urlpost', postData);
  }

}
