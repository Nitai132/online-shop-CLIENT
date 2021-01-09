import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  categories = [
    {
      name: '',
      _id: ''
    }
  ]
  selectedCategory = '';
  products = [];
  filteredArray = [];
  constructor() { }
  @Output() productAdded = new EventEmitter<string>();
  @Output() productEdit = new EventEmitter<object>();
  @Input() isAdmin: String;


  filterProducts({target: {value}}) {
    const filteredArray = this.products.filter(filtered => filtered.name.toLowerCase().includes(value))
    this.filteredArray = filteredArray
  }

  selectedChanged(val) {
    this.selectedCategory = val;
    console.log(val);
    fetch(`/api/products/getByCategory/${this.selectedCategory}`)
    .then(res => res.json())
    .then(data => {
      this.products = data;
      this.filteredArray = data;
      console.log(data)
    });
  };

  addProductToCart(productId) {
    this.productAdded.emit(productId);
  }

  editProduct(id, name, price, img) {
    const editObj = {id, name, price, img};
    this.productEdit.emit(editObj)
  };

  ngOnInit(): void {
    fetch('/api/categories/all')
    .then(res => res.json())
    .then(data => {
      this.categories = data;
      this.selectedCategory = this.categories[0]._id;
    }).then(() => {
      fetch(`/api/products/getByCategory/${this.selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        this.products = data;
        this.filteredArray = data;
      }) 
    })   

  }

}
