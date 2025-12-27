import { Component } from '@angular/core';
import{Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {

  email='';
  otp='';
  name='';
  loading= false;
  msg='';
  err = '';

  constructor(private auth:AuthService,private router:Router) {}

  async verify() {
    this.msg = '';
    this.err = '';

    try {
      this.loading = true;
      const data = await this.auth.verifyOtp(this.email,this.otp,this.name);
      this.msg = data?.message || 'login sucess';
      this.router.navigate(['/dashboard']);
    }catch (e:any) {
      this.err ='otp verify fail';
    }
  }

}
