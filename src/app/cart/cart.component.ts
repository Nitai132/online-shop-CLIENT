import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
declare let alertify: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnChanges {
  totalPrice = 0;
  cartProducts = [];
  productsDetails = [];
  fileToUpload = null;
  newProductPrice = null;
  newProductName = '';
  categories = [];
  selectCategory = '';
  editUploadImg = null;
  constructor() { }
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() Product: String;
  @Input() Cart: String;
  @Input() isAdmin: Number;
  @Input() editDetails: {
    id: '',
    name: '',
    price: '',
    img: any
  };

   getAllProducts() {
    fetch(`/api/cart/getAllProducts/${this.Cart}`)
    .then(res => res.json())
    .then( async (data) => {
      this.cartProducts = data;
      const promises = await Promise.all(this.cartProducts.map(product => fetch(`/api/products/getDetails/${product.productId}`)))
      const productsArray = await Promise.all(promises.map(p => p.json()))
      this.productsDetails = productsArray;
      this.updateTotalPrice();
    });
  };
  updateTotalPrice() {
    let value = 0;
    for(let i=0; i<this.cartProducts.length; i++) {
      value +=this.cartProducts[i].amount * this.productsDetails[i][0].price;
    };
    this.totalPrice = value;
  };

  decreaseAmount(productId) {
    const objToSend = {cartId: this.Cart, productId: productId}
    fetch('/api/cart/decreaseProduct', {
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
    .then((res) =>res.json())
      .then(response => {
        if (response.decrease.err) {
          alertify.error(response.decrease.err)
        } else {
          this.getAllProducts();
        };
    });
  };

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

newProductPriceHandler({target: {value}}) {
  this.newProductPrice = value;
}

newProductNameHandler({target: {value}}) {
  this.newProductName = value;
  console.log(this.editDetails)
}

editProductNameHandler({target: {value}}) {
  this.editDetails.name = value;
}

editProductPriceHandler({target: {value}}) {
  this.editDetails.price = value;
}

editProductImgHandler(files: FileList) {
  this.editUploadImg = files.item(0);
  this.editDetails.img = files.item(0).name;
}

addProduct() {
  const formData = new FormData();
  formData.append('mypic', this.fileToUpload)
  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  .then(() => {
    const objToSend = {
      name: this.newProductName, 
      category: this.selectCategory, 
      price: this.newProductPrice, 
      img: this.fileToUpload.name
    }
    fetch('/api/products/addNewProduct', {
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
    .then(() => alert('your item has been added successfully. click on the category you have changed to view added items'))
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err))
}

editProduct() {
  const formData = new FormData();
  formData.append('mypic', this.editUploadImg)
  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  .then(() => {
    const objToSend = {
      _id: this.editDetails.id,
      name: this.editDetails.name, 
      price: this.editDetails.price, 
      img: this.editDetails.img
    }
    fetch('/api/products/editProduct', {
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
    .then(() => {
      console.log(objToSend, this.editUploadImg)
      alert('your item has been edited successfully. refresh the category to see the changes')})
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err))
}

  increaseAmount(productId) {
    const objToSend = {cartId: this.Cart, productId: productId}
    fetch('/api/cart/increaseProduct', {
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
    .then(() => {
      this.getAllProducts();
    })
  }

  deleteItem(productId) {
    const objToSend = {cartId: this.Cart, productId: productId}
    fetch('/api/cart/deleteProduct', {
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
    }).then(() => {
      this.getAllProducts()        
    })
  }
  ngOnChanges() {
    if(this.Cart.length > 0) {
      this.getAllProducts();
    };
  };

  deleteAllItems() {
    fetch(`/api/cart/deleteAllProducts/${this.Cart}`)
    .then(() => {
      this.getAllProducts();
    })
  }


  ngOnInit(): void {
      fetch('/api/categories/all')
      .then (res => res.json())
      .then(data => this.categories = data);
  }

}
