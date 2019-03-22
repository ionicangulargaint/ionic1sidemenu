import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, Events } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Settings } from '../providers';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = FirstRunPage;
  userLogin: boolean = false;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: 'DashboardPage' },
    { title: 'My Profile', component: 'ProfilePage' },
    { title: 'My Bookings', component: 'MyBookingsPage' },
    { title: 'Logout', component: 'logout' }
  ]

  constructor(public events: Events, public menuCtrl: MenuController, private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();

    events.subscribe('user:loggedin', (user, time) => {
      this.userLogin = true;
      localStorage.setItem('userDetails', JSON.stringify(user));
      // user and time are the same arguments passed in `events.publish(user, time)`
      //console.log('Welcome', user, 'at', time);
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    if (page.component == 'logout') {
      this.logout();
    } else {
      this.nav.push(page.component);
    }
  }

  navigateToLogin() {
    this.nav.push('LoginPage');
    this.menuCtrl.close();
  }

  navigateToRegistration() {
    this.nav.push('SignupPage');
    this.menuCtrl.close();
  }

  logout() {
    localStorage.clear();
    this.userLogin = false;
    this.nav.setRoot('DashboardPage');
    this.menuCtrl.close();
  }
  
}
