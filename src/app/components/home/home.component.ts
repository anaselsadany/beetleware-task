import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { FAKE_DATA } from 'src/app/data/data';
import { AuthService } from 'src/app/services/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userRole: 'user' | 'admin' = 'user';

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _toastr: ToastrService,
    private _modal: BsModalService) {
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
    this._toastr.success('User Saved Successfully', 'User Data');
  }

  deleteUser(user: any) {
    console.log('delete', user);
    this.temp.splice(this.temp.findIndex(el => el.id == user.id), 1);
    this.rows = this.temp;
    this._toastr.success('User Deleted Successfully', 'User Delete')
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
      this.userRole === 'admin' ? [{ prop: 'name' }, { name: 'Email' }, { name: 'Phone' }, { name: 'Status' }, { name: 'Action', headerTemplate: this.hdrTpl, cellTemplate: this.editTmpl, sortable: false }]
        : [{ prop: 'name' }, { name: 'Email' }, { name: 'Phone' }, { name: 'Status' }];
  }

  logout() {
    this._auth.logout()
      .subscribe(success => {
        if (success) this._router.navigateByUrl('/login');
      })
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
