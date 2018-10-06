import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController,LoadingController,Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { Api, CommonService} from '../../providers';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  public showPasswordText:boolean = false;
  public showPasswordText1:boolean = false;
  public showPasswordText2:boolean = false;
  public changePasswordForm: FormGroup;

  constructor(
    public api: Api,
    public toastCtrl: ToastController,
    private _FORMBUILDER: FormBuilder,
    public loadingCtrl: LoadingController,
    public commonService:CommonService
    ) {
    this.changePasswordForm = this._FORMBUILDER.group({
      'oldpassword': ['', Validators.required],
      'newpassword': ['', Validators.required],
      'confirmpassword': ['', Validators.required]
    });
  }

  loading: Loading;
  loadingConfig: any;
  createLoader(message: string = "Please wait...") { 
    this.loading = this.loadingCtrl.create({
      content: message
    });
  }

  updateProfile(){
    if(this.changePasswordForm.controls['newpassword'].value != this.changePasswordForm.controls['confirmpassword'].value){
      this.commonService.showAlert('New password and confirm password should be same.');
      return;
    }
    let data = {
      user_id: localStorage.getItem('user.user_id'),
      password: this.changePasswordForm.controls['newpassword'].value,
      oldpassword: this.changePasswordForm.controls['oldpassword'].value
    }
    this.createLoader();
    console.log(data)
    this.loading.present().then(() => {
      this.api.get('changepassword.php?', data).subscribe((resp: any) => {
        this.loading.dismiss();
        this.commonService.showAlert(resp.result);
        if(resp.status == '1'){
          console.log('success');
        }        
      }, (err) => {
        this.loading.dismiss();
        this.commonService.showAlert('An server error occured.');
      });
    })
  }
}
