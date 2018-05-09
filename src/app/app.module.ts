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
import { Menu01Page} from '../pages/menu01/menu01';
import { Menu02Page} from '../pages/Menu02/Menu02';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
<<<<<<< HEAD
    game
=======
    LoginPage,
    CadastroPage,
    Menu01Page,
    Menu02Page
>>>>>>> origin/master
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
<<<<<<< HEAD
    game
=======
    LoginPage,
    CadastroPage,
    Menu01Page,
    Menu02Page
>>>>>>> origin/master
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
