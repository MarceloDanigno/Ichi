import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { game } from '../game/game';
import { SalaPage } from '../Sala/Sala';
import { ConfigPage } from '../Config/Config';

@IonicPage()
@Component({
  selector: 'page-menu02',
  templateUrl: 'menu02.html',
})
export class Menu02Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Menu02Page');
  }
  game(){
    this.navCtrl.push( game );
  }
  criar(){
    this.navCtrl.push( SalaPage );
  }
  config(){
    this.navCtrl.push( ConfigPage );
  }
}
