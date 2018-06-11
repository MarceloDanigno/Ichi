import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import { HTTP } from '@ionic-native/http';
import { Menu02Page } from '../Menu02/Menu02';
import * as $ from 'jquery';

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html'
})


export class CadastroPage{
    
  public cadastroForm: any;
  errorNome = false;
  errorSenha = false;
  errorSenha2= false;
  errorEmail = false;     //declarando variáveis para verificação e autenticação
  messageEmail = "";
  messageNome = "";
  messageSenha = "";
  messageSenha2 = "";
  
  constructor(public navCtrl: NavController,formBuilder: FormBuilder, private http: HTTP){
    this.cadastroForm = formBuilder.group({
      nome: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(16),
        Validators.required])],
      email: ['', Validators.compose([Validators.pattern(".+\@.+\..+"), Validators.required])],
      senha: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
        Validators.required])],
      senha2:['', Validators.required]
    }) //fazendo validações triviais
  
  
  } 
  
  public Senha: string;
  public Senha2: string;
  public Email: string;  //declarando variáveis para pegar os dados do usuário
  public Nome: string;
  public Confirma: boolean;
  cadastro(){
    let{nome, senha, senha2, email} = this.cadastroForm.controls;
   if(!this.cadastroForm.valid || this.Senha2 != this.Senha){
    if(!nome.valid){ //Validação do tamanho do nickname
       this.errorNome = true;
       this.messageNome = "Deve ter de 4-16 caracteres";
     }
     else{
       this.messageNome = "";
     }
    if(!senha.valid){ //Validação do tamanho da senha
        this.errorSenha = true;
        this.messageSenha = "Deve ter de 6-20 caracteres";
    }
    else{
      this.messageSenha = "";
    }
    if(!senha2.valid){ //Validação da confirmação da senha
      this.errorSenha2 = true;             
      this.messageSenha2 = "Senha inválida";
    }
    else{
    this.messageSenha2 = "";
    }
    if(!email.valid){ //Validação do formato do e-mail
      this.errorEmail = true;
      this.messageEmail = "E-mail inválido!";
    }
    else{
      this.messageEmail = "";
    }
    if(this.Senha != this.Senha2){ //Verificando se as senhas são iguais
      this.Confirma = true;
    }
    else{
      this.Confirma = false;
    }
    /*function CheckEmail(email) {
      var data = {email: email};
      $.ajax({
          type : "POST",
          dataType: "json",
          url : 'http://127.0.0.1:5000/Users/CheckEmail/',
          data: JSON.stringify(data),
          contentType: 'application/json;charset=UTF-8',
          success: function(result) {
              $('#CheckEmail').children('#result').hide().html(JSON.stringify(result)).show();
          }
      });
  }
  
  function CheckNickname(nickname) {
      var data = {nickname: nickname};
      $.ajax({
          type : "POST",
          dataType: "json",
          url : 'http://127.0.0.1:5000/Users/CheckNickname/',
          data: JSON.stringify(data),
          contentType: 'application/json;charset=UTF-8',
          success: function(result) {
              $('#CheckNickname').children('#result').hide().html(JSON.stringify(result)).show();
          }
      });
  }
  */
  }else{    //Passou pelas verificações
    this.messageEmail = "";
    this.messageSenha = "";
    this.messageSenha2 = "";
    this.messageNome = "";
    this.Confirma = false;
    alert("Cadastro realizado com sucesso!");
    var user = {nickname: (this.Nome), email: (this.Email), password: Md5.hashStr(this.Senha)};
    var usuario: string= JSON.stringify(user);
    //var data = {nickname: $('#user-nickname').val(), email: $('#user-email').val(), password: $.md5($('#user-password').val())};
    $.ajax({
        type : "POST",
        dataType: "json",
        url : "http://127.0.0.1:5000/Users/Insert/",
        data: usuario,
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
            console.log(result);
            $('#InsertUser').children('#result').hide().html(JSON.stringify(result)).show();
        }
    });
    sessionStorage.setItem('usuario', user.nickname);
    this.navCtrl.push(Menu02Page);
  }
  }
}
  