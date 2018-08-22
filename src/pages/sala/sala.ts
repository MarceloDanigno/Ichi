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
    console.log("invite");
  }
  jogador1(){
    console.log("jogador1");
  }
  jogador2(){
    console.log("jogador2");
  }
  jogador3(){
    console.log("jogador3");
  }
  jogador4(){
    console.log("jogador4");
  }
  jogador5(){
    console.log("jogador5");
  }
  jogador6(){
    console.log("jogador6");
  }
}