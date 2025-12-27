import { Component } from '@angular/core';
import{Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrl: './send-otp.component.css'
})
export class SendOtpComponent {

  email='';
  loading= false;
  msg='';
  err = '';

  constructor(private auth:AuthService,private router:Router) {}

  async send() {
    this.msg = '';
    this.err = '';

    try {
      this.loading = true;
      const data = await this.auth.sendOtp(this.email);
      this.msg = data?.message || 'otp sent';
      localStorage.setItem('otp_email',this.email);
      this.router.navigate(['/verify-otp']);
    }catch (e:any) {
      this.err ='otp send fail';
    }
  }

}
