import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { game } from '../pages/game/game';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { Menu02Page} from '../pages/menu02/menu02';
import { ConfigPage } from '../pages/config/config';
import {ComoPage} from '../pages/como/como';
import {CreditosPage} from '../pages/creditos/creditos';
import { HTTP } from '@ionic-native/http';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    game,
    LoginPage,
    CadastroPage,
    Menu02Page,
    ConfigPage,
    ComoPage,
    CreditosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    game,
    LoginPage,
    CadastroPage,
    Menu02Page,
    ConfigPage,
    ComoPage,
    CreditosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
