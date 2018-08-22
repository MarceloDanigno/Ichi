import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Menu02Page} from '../Menu02/Menu02';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import * as $ from 'jquery';

let id: string;

sessionStorage.setItem("id", id);
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
      var user = {column: (this.Nome), password: Md5.hashStr(this.Senha), socket_id: "socket"};
      $.ajax({
        type : "POST",
        headers: {"Access-Control-Allow-Origin": "http://127.0.0.1:5000",
        "Access-Control-Allow-Headers": "*"},
        dataType: "json",
        url : 'http://127.0.0.1:5000/Login/',
        data: JSON.stringify(user),
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
            $('#Login').children('#result').hide().html(JSON.stringify(result)).show();
          }
    });
      this.navCtrl.push(Menu02Page);
      this.messageSenha = "";
      this.messageNome = "";
      sessionStorage.setItem('user', user.column);
      sessionStorage.setItem('password', (this.Senha));
    }
  }
}