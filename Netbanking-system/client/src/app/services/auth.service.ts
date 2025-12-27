import { Injectable } from '@angular/core';
import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:5600/api/auth';

  constructor() { }

  async register(data:{name:string;email:string,password:string}) {
    return axios.post(`${this.API_URL}/register`,data);
  }
  async login(data:{email:string,password:string}) {
  const res = await axios.post(`${this.API_URL}/login`,data);
  const token = res.data.token;

  if(token) {
    localStorage.setItem('token',token);
  }
  return res;
  }

  logout() {
    localStorage.removeItem('token');
     localStorage.removeItem('otp_email');
  }

  getToken():string |null {
    return localStorage.getItem('token');
  }
  isLoggedin():boolean {
    return !!this.getToken();
  }

   async getDashboard() {
    const token = this.getToken();

    return axios.get(`${this.API_URL}/dashboard`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
  }

  async sendOtp(email:string) {
    const res = await axios.post(`${this.API_URL}/otp/send`,{email});
    return res.data;
  }

  async verifyOtp(email:string,otp:string,name?:string) {
    const res = await axios.post(`${this.API_URL}/otp/verify`,{email,otp,name});
    if(res.data?.token) {
      localStorage.setItem('token',res.data.token);
    }
    return res.data;
  }
  


}
