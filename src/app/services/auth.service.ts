import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  LoginRes} from '../models/login-res';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  login(data:object):Observable<LoginRes>
  {
    return this.http.post<LoginRes>('http://68.183.221.11:7770/ForensicEvidence/api/Authentication/login',data)
  }
}
