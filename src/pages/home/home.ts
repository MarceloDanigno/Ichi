import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import {Menu02Page} from '../Menu02/Menu02';
//import { game } from '../game/game';
import { LoginPage } from '../login/login';
import { CadastroPage} from '../cadastro/cadastro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }
  login(){
    this.navCtrl.push(LoginPage);
  }
  cadastro(){
    this.navCtrl.push(CadastroPage);
  }
}
