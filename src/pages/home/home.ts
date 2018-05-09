import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Menu01Page} from '../menu01/menu01';
//import {Menu02Page} from '../Menu02/Menu02';

import { game } from '../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  test(){
    console.log("Indo para menu01");
    this.navCtrl.push(Menu01Page);
  }
}
