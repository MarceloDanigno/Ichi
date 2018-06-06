import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { FormBuilder, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import { HTTP } from '@ionic-native/http';
//import { game } from '../game/game';
import { Menu02Page } from '../Menu02/Menu02';

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html'
})


export class CadastroPage{
    
  public cadastroForm: any;
  errorNome = false;
  errorSenha = false;
  errorSenha2= false;
  errorEmail = false;
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
    })
  
  
  } 
  public Senha: string;
  public Senha2: string;
  public Email: string; 
  public Nome: string;
  public Confirma: boolean;
  cadastro(){
    console.log(usuario);
    let{nome, senha, senha2, email} = this.cadastroForm.controls;
   if(!this.cadastroForm.valid || this.Senha2 != this.Senha){
    if(!nome.valid){
       this.errorNome = true;
       this.messageNome = "Deve ter de 4-16 caracteres";
     }
     else{
       this.messageNome = "";
     }
    if(!senha.valid){
        this.errorSenha = true;
        this.messageSenha = "Deve ter de 6-20 caracteres";
    }
    else{
      this.messageSenha = "";
    }
    if(!senha2.valid){
      this.errorSenha2 = true;
      this.messageSenha2 = "Senha inválida";
  }
  else{
    this.messageSenha2 = "";
  }
    if(!email.valid){
      this.errorEmail = true;
      this.messageEmail = "E-mail inválido!";
    }
    else{
      this.messageEmail = "";
    }
    if(this.Senha != this.Senha2){
      this.Confirma = true;
    }
    else{
      this.Confirma = false;
    }
  }else{
    this.messageEmail = "";
    this.messageSenha = "";
    this.messageSenha2 = "";
    this.messageNome = "";
    this.Confirma = false;
    alert("Cadastro realizado com sucesso!");
    var user = {nickname: (this.Nome), email: (this.Email), senha: Md5.hashStr(this.Senha)};
    var usuario: string= JSON.stringify(user);
    var data = {nickname: $('#user-nickname').val(), email: $('#user-email').val(), password: $.md5($('#user-password').val())};
    $.ajax({
        type : "POST",
        dataType: "json",
        url : "http://127.0.0.1:5000/Users/Insert/",
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
            $('#InsertUser').children('#result').hide().html(JSON.stringify(result)).show();
        }
    });
    this.navCtrl.push(Menu02Page);
  }
   
  }
}
  