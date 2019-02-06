import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavParams, IonicPage, NavController, ToastController, Events, LoadingController, Loading, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../providers';

@IonicPage()
@Component({
  selector: 'login-as-guest-modal',
  templateUrl: 'login-as-guest-modal.html'
})
export class LoginAsGuestModalPage {
  loginModel: any = 'login';
  changeStatus:any;
  currentCountry: any = {
    code: '',
    number: ''
  };
  public loginError: any = {
    show: false,
    msg: ''
  }
  public continueAsGuestError: any = {
    show: false,
    msg: ''
  }

  public loginForm: FormGroup;
  public continueAsGuestForm: FormGroup;

  constructor(
    public user: User,
    public viewCtrl: ViewController,
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public events: Events,
    public loadingCtrl: LoadingController,
    private navParams:NavParams
  ) {
    this.changeStatus =  this.navParams.get("change");
    this.loginForm = this._FORMBUILDER.group({
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'password': ['', Validators.required]
    });
    this.continueAsGuestForm = this._FORMBUILDER.group({
      'fname': ['', Validators.required],
      'lname': ['', Validators.required],
      'mobile': ['', Validators.required],
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]]
    })
  }

  // Attempt to login in through our User service
  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  doLogin() {
    this.createLoader();
    this.loading.present().then(() => {
      let data = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value
      }
      this.user.login(data, 'EMAIL').subscribe((resp: any) => {
        this.loading.dismiss();
        if (resp.login == 'failed') {
          this.loginError.show = true;
          this.loginError.msg = 'Wrong email or password.';
        } else {         
          this.events.publish('user:loggedin', resp, Date.now());
          this.changeParentStatus('LOGIN', resp);
        }
      }, (err) => {
        this.loginError.show = true;
        this.loginError.msg = 'An server error occured.';
        this.loading.dismiss();
      });
    })


  }

  continueAsGuest() {
    let data = {
      fname: this.continueAsGuestForm.controls['fname'].value,
      lname: this.continueAsGuestForm.controls['lname'].value,
      mobile: this.continueAsGuestForm.controls['mobile'].value,
      email: this.continueAsGuestForm.controls['email'].value
    }
    this.changeParentStatus('ASGUEST', data);
  }

  ionViewDidLoad() {
    
  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  changeParentStatus(type, data) {
    this.viewCtrl.dismiss();
    this.changeStatus({
      type: type,
      data: data
    });
 }

}
