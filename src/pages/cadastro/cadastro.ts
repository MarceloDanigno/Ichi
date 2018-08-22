import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import { Menu02Page } from '../menu02/menu02';
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
   var Email = {email: (this.Email)};
    $.ajax({ //função para checar o e-mail
      type : "POST",
      dataType: "json",
      url : 'http://10.10.15.15:5000/Users/CheckEmail/',
      data: JSON.stringify(Email),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        sessionStorage.setItem('resultadoEmail', result.available);
        /* result{
              stats --> 0: E-mail vazio ou None ||| 1: E-mail válido.
              Available --> 0: E-mail não disponível ||| 1: E-mail disponível.
        */
      }
  });
  var resultadoEmail = sessionStorage.getItem('resultadoEmail');
  if(resultadoEmail == '0'){  
    this.errorEmail = true;
    this.messageEmail = "E-mail já está sendo utilizado!";
  }
  else{
    this.errorEmail = false;
    this.messageEmail = "";
  }
//----------------------VERIFICAÇÃO DE NICKNAME-----------------------------------------------
    var NICKNAME = {nickname: (this.Nome)};
    $.ajax({
      type : "POST",
      dataType: "json",
      url : 'http://10.10.15.15:5000/Users/CheckNickname/',
      data: JSON.stringify(NICKNAME),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
          sessionStorage.setItem('resultadoNick', result.available);
        }
    });
    var resultadoNick = sessionStorage.getItem('resultadoNick');
    if(resultadoNick == '0'){
      this.errorNome = true;
      this.messageNome = "Nickname já está sendo utilizado!";
    }
    else{
      this.errorNome = false;
      this.messageNome = "";
    }
    //-----------------------CADASTRO DE USUÁRIO-------------------------------------------------
    
    if(resultadoEmail == resultadoNick && resultadoEmail == '1'){
      var user = {nickname: (this.Nome), email: (this.Email), password: Md5.hashStr(this.Senha), socket_id: "socket"}; 
    $.ajax({ //função para cadastrar o usuário
      type : "POST",
      dataType: "json", 
      url : "http://10.10.15.15:5000/Register/",
      data: JSON.stringify(user),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
         alert("Cadastro realizado com sucesso!");
      }
  });
  } 
   }
  }
}
  