import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { game } from '../game/game';
import { ConfigPage } from '../config/config';
import { ComoPage } from '../como/como';
import { CreditosPage} from '../creditos/creditos';

@IonicPage()
@Component({
  selector: 'page-menu02',
  templateUrl: 'menu02.html',
})
export class Menu02Page {
  @ViewChild('nickname') nickname;
  @ViewChild('vitorias') vitorias;
  @ViewChild('derrotas') derrotas;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    var texto = sessionStorage.getItem('usuario');
    this.nickname.nativeElement.innerHTML = texto;
    var texto2 = sessionStorage.getItem('vitorias');
    this.vitorias.nativeElement.innerHTML = texto2;
    var texto3 = sessionStorage.getItem('derrotas');
    this.derrotas.nativeElement.innerHTML = texto3;    
  }
  game(){
    this.navCtrl.push( game );
  }
  config(){
    this.navCtrl.push( ConfigPage );
  }
  comojogar(){
    this.navCtrl.push( ComoPage );
  }
  creditos(){
    this.navCtrl.push( CreditosPage );
  }
}