import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import { Menu02Page } from '../Menu02/Menu02';
import * as $ from 'jquery';

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html'
})



export class CadastroPage{
    
  public cadastroForm: any;
  socket: any = null;
  errorNome = false;
  errorSenha = false;
  errorSenha2= false;
  errorEmail = false;     //declarando variáveis para verificação e autenticação
  messageEmail = "";
  messageNome = "";
  messageSenha = "";
  messageSenha2 = "";
  constructor(public navCtrl: NavController,formBuilder: FormBuilder){
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
  }else{    //Passou pelas verificações iniciais
    this.messageEmail = "";
    this.messageSenha = "";
    this.messageSenha2 = "";
    this.messageNome = "";
    this.Confirma = false;
   
//------------VERIFICAÇÃO DE E-MAIL--------------------------------------------------------   

//var data = {email: $('#check-email').val()}; modelo de dado a ser enviado
    
    var Email = {email: (this.Email)};
    
    $.ajax({ //função para checar o e-mail
      type : "POST",
      dataType: "json",
      url : 'http://127.0.0.1:5000/Users/CheckEmail/',
      data: JSON.stringify(Email),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          $('#CheckEmail').children('#result').hide().html(JSON.stringify(result)).show();
      }
  });
    
//----------------------VERIFICAÇÃO DE NICKNAME-----------------------------------------------
//var data = {nickname: $('#check-nickname').val()}; modelo de dado a ser enviado
    var NICKNAME = {nickname: (this.Nome)};
   /* $({
      socket = io.connect('http://127.0.0.1:5000');
    }); */
    $.ajax({
      type : "POST",
      dataType: "json",
      url : 'http://127.0.0.1:5000/Users/CheckNickname/',
      data: JSON.stringify(NICKNAME),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          $('#CheckNickname').children('#result').hide().html(JSON.stringify(result)).show();
    }
}); 
    var user = {nickname: (this.Nome), email: (this.Email), password: Md5.hashStr(this.Senha), socket_id: "socket"};
    
    //-----------------------CADASTRO DE USUÁRIO-------------------------------------------------
    $.ajax({ //função para cadastrar o usuário
      type : "POST",
      dataType: "json", 
      url : "http://127.0.0.1:5000/Register/",
      data: JSON.stringify(user),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          $('#InsertUser').children('#result').hide().html(JSON.stringify(result)).show();
      }
  }); 
    alert("Cadastro realizado com sucesso!");
  }
  }
}
  