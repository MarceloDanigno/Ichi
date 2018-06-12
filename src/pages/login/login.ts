import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Menu02Page} from '../Menu02/Menu02';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
/*let id: string;
let num: number;

sessionStorage.setItem(id, "id");
*/
export class LoginPage {

  public loginForm: any; 
  errorNome = false;
  errorSenha = false;
  messageNome = "";
  messageSenha = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      nome: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }
  public Senha: string;  //declarando variáveis para pegar os dados do usuário
  public Nome: string;
  public Confirma: boolean;
  
  login(){
    let{nome, senha} = this.loginForm.controls;
    
    if(!this.loginForm.valid){
      if(!nome.valid){
        this.errorNome = true;
        this.messageNome = "Usuário inválido!"
      }
      else{
        this.messageNome = "";
      }
      if(!senha.valid){
        this.errorSenha = true;
        this.messageSenha = "Senha inválida!"
      }
      else{
        this.messageSenha = "";
      }
    }
    else{
      var user = {nickname: (this.Nome), password: Md5.hashStr(this.Senha)};
      this.messageSenha = "";
      this.messageNome = "";
      this.navCtrl.push(Menu02Page);
      sessionStorage.setItem('usuario', user.nickname);
    }
  }
}
