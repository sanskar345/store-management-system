import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {

  //just database things --

  itemsData = [
    {
      name: 'item1',
      size: 'big',
      brand: 'brand1',
      rate: '822.22',
      mrp: '900',
      stockQuantity: 5582,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item2',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '920',
      stockQuantity: 777,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item3',
      size: 'big',
      brand: 'brand1',
      rate: '822.9',
      mrp: '999',
      stockQuantity: 523,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item4',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '999',
      stockQuantity: 66,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item5',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '888',
      stockQuantity: 55,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item6',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '888',
      stockQuantity: 9,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item7',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '882',
      stockQuantity: 8,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'item8',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '862',
      stockQuantity: 77,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'sans',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '822',
      stockQuantity: 44,
      id: '59656',
      category: 'fygy'
    },
    {
      name: 'boro',
      size: 'big',
      brand: 'brand1',
      rate: '822',
      mrp: '822',
      stockQuantity: 52,
      id: '59656',
      category: 'fygy'
    }

  ]

  //......

  customers = [
    {
      name: 'sanskar',
      address: 'bamhori',
      mobileNumber: '85858585852',
      id: '789'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '8823078781',
      id: '456'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '78787878789',
      id: '456'
    },
    {
      name: 'trilok',
      address: 'indore',
      mobileNumber: '78787878789',
      id: '456'
    },
    {
      name: 'trilok singh tikambar khan rajput',
      address: 'indore',
      mobileNumber: '9696969696',
      id: '456'
    },
    {
      name: 'trilok singh tikambar khan rajput',
      address: 'indore',
      mobileNumber: '9696969696',
      id: '456'
    }
  ];

  constructor(

  ) { }


}
