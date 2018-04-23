import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { game } from '../game/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

gamepage()
{
	this.navCtrl.push(game)
}

}
