import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
declare let alertify: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router) { }
  userDetails = {
    firstName: '',
    _id: '',
    isAdmin: null
  };
  cart = '';
  addedProducts = [];
  itemToEdit = {};

  addProductToCart(productId) {
    const objToSend = {productId: productId, cartId: this.cart}
    console.log(objToSend)
    fetch('/api/cart/addProduct', {
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
    .then(res => res.json())
    .then(data => {
      if (data.itemExists) {
        alertify.error(data.itemExists)
      } else {
        this.addedProducts = data.productId
      }
    })
  }

  logout() {
    fetch('/api/auth/logout')
    .then(() => {
      this.router.navigate(['/login']);
    });
  };

  editProduct(editDetailsObj) {
    this.itemToEdit = editDetailsObj;
  }
  
  ngOnInit(): void {
    fetch('/api/auth/userDetails')
    .then(response => response.json())
    .then((data) => {
      this.userDetails = data;
    }).catch((err) => {
      console.log(err);
      this.router.navigate(['/login']);
    })
    .then(() => {
      console.log(this.userDetails._id)
      fetch(`/api/cart/findCart/${this.userDetails._id}`)
      .then(res => res.json())
      .then(cart => {
        this.cart = cart._id;
      })
    })

  }

}
