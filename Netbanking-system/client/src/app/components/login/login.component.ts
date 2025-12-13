import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  'loginForm':FormGroup;
  loading = false;
  error='';
  success='';

   constructor(
    private fb:FormBuilder,
    private auth:AuthService,
    private router:Router

  ) {}

  ngOnInit(): void {
   this.loginForm = this.fb.group({
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required],

  });
  }
  async onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      await this.auth.login(this.loginForm.value as any);
       this.router.navigate(['/dashboard']);
    } catch(err:any){
      this.error = err;
    }
  }

}
