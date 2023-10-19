import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { FAKE_DATA } from 'src/app/data/data';
import { AuthService } from 'src/app/services/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userRole: 'user' | 'admin' = 'user';
  lang: any = "en"
  constructor(
    private translate: TranslateService,
    private _auth: AuthService,
    private _router: Router,
    private _toastr: ToastrService,
    private _modal: BsModalService) {
      this.lang = localStorage.getItem('language') || 'en';

    document.body.id = 'HomePage';
    this.userRole = this._auth.userData()?.role || 'user';

    // cache our list
    this.temp = [...FAKE_DATA];
    // push our inital complete list
    this.rows = FAKE_DATA;
  }

  saveUserData(user: any) {
    if (user?.id) {
      console.log('update', user);
      let userData = this.temp.find(el => el.id == user.id);
      userData.name = user.name;
      userData.email = user.email;
      userData.phone = user.phone;
    } else {
      this.temp.push(user);
    }

    this.rows = this.temp;
    this._toastr.success(this.translate.instant('UserSavedSuccessfully'), this.translate.instant('UserData'));

  }

  deleteUser(user: any) {
    console.log('delete', user);
    this.temp.splice(this.temp.findIndex(el => el.id == user.id), 1);
    this.rows = this.temp;
    // this._toastr.success('UserDeletedSuccess', 'UserDelete')
    this._toastr.success(this.translate.instant('UserDeletedSuccess'), this.translate.instant('UserDelete'));

  }

  //#region popup form
  modalRef?: BsModalRef;
  selectedUser!: any;
  addNew(template: TemplateRef<any>) {
    this.selectedUser = null;
    this.modalRef = this._modal.show(template, { class: 'modal-lg' });
  }
  updateDat(user: any, template: TemplateRef<any>) {
    this.selectedUser = user;
    this.modalRef = this._modal.show(template, { class: 'modal-lg' });
  }
  //#endregion

  ngOnInit(): void {
    this.columns =
      this.userRole === 'admin' ? [{ name: 'Name', headerTemplate: this.hdrTpl }, { name: 'Email', headerTemplate: this.hdrTpl }, { name: 'Phone', headerTemplate: this.hdrTpl }, { name: 'status', headerTemplate: this.hdrTpl }, { name: 'Action', headerTemplate: this.hdrTpl, cellTemplate: this.editTmpl, sortable: false }]
        : [{ name: 'Name', headerTemplate: this.hdrTpl }, { name: 'Email', headerTemplate: this.hdrTpl }, { name: 'Phone', headerTemplate: this.hdrTpl }, { name: 'status', headerTemplate: this.hdrTpl }];
  }
  logout() {
    this._auth.logout()
      .subscribe(success => {
        if (success) this._router.navigateByUrl('/login');
      })
  }
  changeLanguage() {
    if (this.lang === 'en') {
      this.lang = 'ar';
      this.translate.use('ar');
      localStorage.setItem('language', 'ar');
    } else {
      this.lang = 'en';
      this.translate.use('en');
      localStorage.setItem('language', 'en');
    }
  }


  //#region datatable section
  @ViewChild('editTmpl', { static: true }) editTmpl!: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl!: TemplateRef<any>;
  rows: any[] = [];
  temp: any[] = [];
  columns: TableColumn[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  ColumnMode = ColumnMode;
  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d: any) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  //#endregion
}
