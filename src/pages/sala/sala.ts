import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ConfigPage} from '../Config/Config';

@IonicPage()
@Component({
  selector: 'page-sala',
  templateUrl: 'sala.html',
})
export class SalaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  return() {
    this.navCtrl.pop();
  }
  config(){
    this.navCtrl.push( ConfigPage );
  }
  invite(){
    console.log(" oi ");
  }
}