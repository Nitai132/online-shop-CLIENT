import { Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from "@angular/router";

declare let alertify: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  userDetails = {
    _id: '',
    firstName: '',
    city: '',
    street: ''
  };
  cart = '';
  products = [];
  productsDetails = [];
  minDate = new Date();
  creditCard = null;
  deliveryDate = '';
  price = null;

  constructor(public dialog: MatDialog, private router: Router) {}

  logout() {
    fetch('/api/auth/logout')
    .then(() => {
      this.router.navigate(['/login']);
    })
  }

  dateChanged({target: {value}}) {
    this.deliveryDate = value.toDateString();
  };

  creditCardChanges({target: {value}}) {
    this.creditCard = value;
  };

  cityChanges({target: {value}}) {
    this.userDetails.city = value;
  };

  streetChanges({target: {value}}) {
    this.userDetails.street = value;
  };


  order() {
    if (this.creditCard.startsWith(4) && this.creditCard.length === 16 || this.creditCard.length === 13) {
      const objToSend = {
        cartId: this.cart, 
        price: this.price, 
        city: this.userDetails.city,
        street: this.userDetails.street,
        clientId: this.userDetails._id,
        deliveryDate: this.deliveryDate,
        creditCard: this.creditCard.substr(this.creditCard.length - 4),
      };
      if(this.deliveryDate.length > 0 && this.userDetails.city.length > 0 && this.userDetails.street.length > 0) {
        fetch('/api/orders/addOrder', {
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
        .then((data) => {
          if(data.failure) {
            alertify.error(data.failure);
          }
          else {
            const toSend = {
              orderId: data.success, 
              cartDetails: this.products, 
              productsDetails: this.productsDetails, 
              totalPrice: this.price,
              userDetails: this.userDetails,
              date: new Date()
            }
            fetch('/api/pdf', {
              method: 'POST',
              mode: 'cors', 
              cache: 'no-cache',
              credentials:'include',
              headers: {
                'Content-Type': 'application/json',
              },
              redirect: 'follow', 
              referrerPolicy: 'no-referrer', 
              body: JSON.stringify(toSend)
            })
            .then(() => {
              alertify.alert()
            .setting({
              'label':'Okay',
              'message': `<span> Your order has been placed. to download your receipt click <a href='http://localhost:4422/receipts/${toSend.orderId}.pdf'>here</a> </span>` ,
              'onok': function(){ alertify.success('your order is done. thanks for shopping with Nitais market.');}
            }).show();
            })
          }
        })
      } else {
        alertify.error('some details are missing');
      };
    } else {
      alertify.error('credit card details are wrong. we accept visa cards only')
    }
  }

  ngOnInit(): void {
    fetch('/api/auth/userDetails')
    .then(res => res.json())
    .then(data => this.userDetails = data)
    .then(() => {
      fetch(`/api/cart/findCart/${this.userDetails._id}`)
    .then(res => res.json())
    .then(data => this.cart = data._id)
    .then(()=> {
      fetch(`/api/cart/getAllProducts/${this.cart}`)
      .then(res => res.json())
      .then(async data => {
        this.products = data;
        const promises = await Promise.all(this.products.map(product => fetch(`/api/products/getDetails/${product.productId}`)))
        const productsArray = await Promise.all(promises.map(p => p.json()))
          this.productsDetails = productsArray;
          let value = 0;
          for(let i=0; i<this.products.length; i++) {
            value +=this.products[i].amount * this.productsDetails[i][0].price;
          }
          this.price = value;
        })
    })
    })
  }
}
