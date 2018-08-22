import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import {Md5} from 'ts-md5/dist/md5';
import * as $ from 'jquery';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {
  senha: any = sessionStorage.getItem('password');
  sair(){
    this.navCtrl.popToRoot();
     //------------------------------------------LOGOUT-----------------------------------------    
   /* var data = {id: $('#logout-id').val(), password: $.md5($('#logout-password').val())};
      var data = {id: ????, password: Md5.hashStr(this.senha)} 
   $.ajax({ //Função de logout
        type : "POST",
        dataType: "json",
        url : 'http://127.0.0.1:5000/Logout/',
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
            $('#Logout').children('#result').hide().html(JSON.stringify(result)).show();
        }
    }); */ 
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }
  PegaDados(){
    $.get("'http://127.0.0.1:5000/'", function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
  });
  }
}
