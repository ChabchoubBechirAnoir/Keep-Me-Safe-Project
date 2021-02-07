import { Component , ViewChild } from '@angular/core';
import { StorageService } from './../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';
import { AuthService } from './../services/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('barChart') barChart;
  @ViewChild('barChart1') barChart1;

  bars: any;
  bars1: any;
  colorArray: any;
  sensordata : any;
payload;
profiledata;
  constructor(
private storageService: StorageService,
private authService : AuthService
  ) {}
  ngOnInit() {
    this.storageService.get(AuthConstants.AUTH).then(data => {
      this.payload = data;
      this.authService.getUserByUsername(data['sub']).subscribe(
        (res: any) => {
          this.profiledata = res[0]
          console.log(this.profiledata);
          console.log("nothing here")
        }
      );
      this.authService.getsensorData().then(data => {
        this.sensordata = data;
      });
    });
 
  }
  logout(){
    this.authService.logout();
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.storageService.get(AuthConstants.AUTH).then(data => {
      this.payload = data;
      this.authService.getUserByUsername(data['sub']).subscribe(
        (res: any) => {
          this.profiledata = res[0]
        }
      );
    
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  ionViewDidEnter() {
    this.createBarChart();
  }
  createBarChart() {
    console.log(this.sensordata)
    this.authService.getsensorData().then(data => {
      this.sensordata = data;
    });
    let a = this.sensordata.map(item=> Number(item.payload))
    let a1 = a.filter(item => item>500)
    let a2 = a.filter(item => item<500)
    let l = a1.length
    let l1 = a1.length
  console.log(a.length)
    let b = this.sensordata.map(item=> item.datetime)
    console.log(a)
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: b.slice(a.length-7),
        datasets: [{
          label: 'MQ5',
          data:  a1.slice(l-7), 
          backgroundColor: 'rgb(255, 255, 255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
          borderWidth: 3  
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
    this.bars1 = new Chart(this.barChart1.nativeElement, {
      type: 'line',
      data: {
        labels: b.slice(a.length-7),
        datasets: [{
          label: 'MQ7',
          data:  a2.slice(l1-7), 
          backgroundColor: 'rgb(255, 255, 255)', // array should have same number of elements as number of dataset
          borderColor: 'rgb(194, 40, 129)',// array should have same number of elements as number of dataset
          borderWidth: 3
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}
