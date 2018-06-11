import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
//import {Menu02Page} from '../Menu02/Menu02';
//import { game } from '../game/game';
import { LoginPage } from '../login/login';
import { CadastroPage} from '../cadastro/cadastro';
import * as $ from 'jquery';


  @Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, platform: Platform) {
  platform.ready().then((readySource)=>{
  
  //var socket = io.connect('http://127.0.0.1:5000');
  //console.log(socket.id); 
  }
)
  }
  login(){
    this.navCtrl.push(LoginPage);
  }
  cadastro(){
    this.navCtrl.push(CadastroPage);
  }
}
