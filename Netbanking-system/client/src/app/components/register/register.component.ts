import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  'registerForm':FormGroup;
  loading = false;
  error='';
  success='';

  constructor(
    private fb:FormBuilder,
    private auth:AuthService,
    private router:Router

  ) {}

  ngOnInit(): void {
   this.registerForm = this.fb.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,Validators.minLength(6)]],

  });
  }
   

  async onSubmit() {
    if(this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    try {
      await this.auth.register(this.registerForm.value as any);
      this.success = 'Registration Success';
      setTimeout(()=> this.router.navigate(['/login']),1000);
    } catch(err:any){
      this.error = err;
    }
  }

}
