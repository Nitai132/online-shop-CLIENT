import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router"
declare let alertify: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder, private router: Router) {}
  email = '';
  password = '';
  confirmPassword = '';
  city='';
  street='';
  firstName='';
  lastName='';

  register() {
    const objToSend = {
        firstName: this.firstName,
        lastName: this.lastName, 
        email: this.email, 
        password: this.password, 
        city: this.city, 
        street: this.street
      }
    fetch('/api/auth/signup', {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', 
      referrerPolicy: 'no-referrer', 
      body: JSON.stringify(objToSend)
    })
    .then(()=> {
      this.router.navigate(['/login']);
    })
    .catch((err) => {
      alertify.error('something went wrong')
      console.log(err)
    })
  }
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
