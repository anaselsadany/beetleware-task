import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() savedUser: EventEmitter<any> = new EventEmitter<any>(true);
  @Input() user!: any;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.initUserForm();
    setTimeout(() => {
      if (this.user)
        this.userForm.patchValue(this.user);
    }, 500);
  }

  initUserForm() {
    this.userForm = this._fb.group({
      id: [null],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      status: ['active'],
      role: ['user', Validators.required]
    });
  }

  save() {
    const user = this.userForm.value;
    this.savedUser.emit(user);
    this.close.emit(true);
  }
}
