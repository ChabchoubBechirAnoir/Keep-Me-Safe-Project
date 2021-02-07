import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class HttpService {
constructor(private http: HttpClient) {}

post(serviceName: string, data: any) {
    const headers = new HttpHeaders();
    const options = { headers: headers, withCredintials: false };
    const url = environment.apiUrl + serviceName;
    var result = this.http.post(url, data, options);
    return result;
}
get(serviceName: string){
    const headers = new HttpHeaders();
    const options = { headers: headers, withCredentials: false };
    const url = environment.apiUrl + serviceName;
    var result = this.http.get(url, options)
    return result
}
}