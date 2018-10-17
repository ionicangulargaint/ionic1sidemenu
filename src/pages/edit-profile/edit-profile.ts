import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { User, Api } from '../../providers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

  public editProfileForm: FormGroup;

  constructor(public loadingCtrl: LoadingController,
    private _FORMBUILDER: FormBuilder,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public api: Api ) {

    this.editProfileForm = this._FORMBUILDER.group({
      'email': ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      'mobile': ['', Validators.required],
      'fname': ['', Validators.required],
      'lname': ['', Validators.required]
    });
  }
  public profileData: any = {};

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") {
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  ionViewDidLoad() {
    this.getUserProfileData();
  }

  getUserProfileData() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.createLoader();
    this.loading.present().then(() => {
      let seq = this.api.get('getUserData.php?getUserProfile=ARQP12345', { "userId": userDetails.user_id }).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "1") {
          this.profileData = res.profile;
          this.editProfileForm.controls['email'].setValue(this.profileData.email);
          this.editProfileForm.controls['lname'].setValue(this.profileData.lname);
          this.editProfileForm.controls['fname'].setValue(this.profileData.fname);
          this.editProfileForm.controls['mobile'].setValue(this.profileData.mob_no);
        } else {
          let toast = this.toastCtrl.create({
            message: 'An server error occured,',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, err => {
        this.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  updateProfile() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.createLoader();
    let data = {
      "user_id": userDetails.user_id,
      "mob_no": this.editProfileForm.controls['mobile'].value,
      "email": this.editProfileForm.controls['email'].value,
      "lname": this.editProfileForm.controls['lname'].value,
      "fname": this.editProfileForm.controls['fname'].value
    }
    this.loading.present().then(() => {
      let seq = this.api.get('getUserData.php?updateUserProfile=updateUser12345', data).share();
      seq.subscribe((res: any) => {
        this.loading.dismiss();
        if (res.result == "success") {          
          let toast = this.toastCtrl.create({
            message: 'Updated successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.getUserProfileData();
        } else {
          let toast = this.toastCtrl.create({
            message: 'An server error occured,',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      }, err => {
        this.loading.dismiss();
        console.error('ERROR', err);
      });
    })
  }

  navigateToForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }
}
