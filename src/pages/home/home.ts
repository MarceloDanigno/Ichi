import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {CadastroPage} from '../cadastro/cadastro';
import {Menu01Page} from '../menu01/menu01';
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
