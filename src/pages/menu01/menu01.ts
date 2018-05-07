import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {CadastroPage} from '../cadastro/cadastro';
/**
 * Generated class for the Menu01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu01',
  templateUrl: 'menu01.html',
})
export class Menu01Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Menu01Page');
  }
  test(){
    console.log("Indo para login");
    this.navCtrl.push(LoginPage);
  }
  test2(){
    console.log("Indo para Cadastro");
    this.navCtrl.push(CadastroPage);
  }
}
