import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Menu02Page} from '../Menu02/Menu02';
import { FormBuilder, Validators} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
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
      this.messageSenha = "";
      this.messageNome = "";
      alert("Login efetuado com sucesso!")
      this.navCtrl.push(Menu02Page);
    }
  }
}
