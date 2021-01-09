import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
declare let alertify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {}
  Email = '';
  Password = '';
  ordersCount = null;
  productsCount = null;
  userDetails = {
    _id: null,
    firstName: null
  };
  order = '';
  cartDate = '';
  logout() {
    fetch('/api/auth/logout')
    .then(() => {
      this.router.navigate(['/']);
    });
  };

  login() {
    const objToSend = {username: this.Email, password: this.Password}
    fetch('/api/auth/login', {
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
    .then((res) => res.json())
    .then((data) => {
        this.userDetails = data;
        if (data.isAdmin == 1) {
          this.router.navigate(['/']);
        }
        fetch(`/api/cart/findCart/${data._id}`)
        .then(res => res.json())
        .then(result => {
            this.cartDate = result.updated_at;
        }).catch(() => {
          fetch(`/api/orders/checkExistance/${data._id}`)
          .then(res => res.json())
          .then(results => {
            this.order = results.date})
        })
    }).catch(() => {
      alertify.error('wrong username or password')
    })
  };

  onPasswordChange({target: {value}}) {
    this.Password = value;
  };

  onEmailChange({target: {value}}) {
    this.Email = value;
  };

  register() {
    this.router.navigate(['/register']);
  }

  startShoping() {
    this.router.navigate(['/']);
  }
  
  ngOnInit(): void {
    fetch('/api/auth/userDetails')
    .then(response => response.json())
    .then((data) => {
      this.userDetails = data;
      if (data.isAdmin == 1) {
        this.router.navigate(['/']);
      }
      fetch(`/api/cart/findCart/${data._id}`)
      .then(res => res.json())
      .then(result => {
          this.cartDate = result.updated_at;
      }).catch(() => {
        fetch(`/api/orders/checkExistance/${data._id}`)
        .then(res => res.json())
        .then(results => {
          this.order = results.date})
      })
    })

    fetch('/api/count/orders')
    .then(res => res.json())
    .then((data) => {
      this.ordersCount = data
    });

    fetch('/api/count/products')
    .then(res => res.json())
    .then((data) => {
      this.productsCount = data;
    });

  }
}
