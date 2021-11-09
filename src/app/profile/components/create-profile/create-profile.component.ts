import { Component, OnInit } from '@angular/core';
import { COMMA, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProfileService } from 'src/app/core/services/profile/profile.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
})
export class CreateProfileComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [SPACE, COMMA] as const;
  knowledge: Array<string> = [];
  activities: Array<string> = [];
  talents: Array<string> = [];
  interests: Array<string> = [];

  form!: FormGroup;

  add(event: MatChipInputEvent, array: Array<string>): void {
    const value = (event.value || '').trim();
    if (value) {
      array.push(value);
    }
    event.chipInput!.clear();
  }

  remove(text: string, array: Array<string>): void {
    const index = array.indexOf(text);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }

  saveProfile(e: Event) {
    e.preventDefault();
    if (this.form.valid) {
      const profileSend = {
        resume: this.form.get('resume')!.value,
        knowledge: this.knowledge,
        activities: this.activities,
        talents: this.talents,
        interests: this.interests,
      };
      console.log(profileSend);
      this.profileService
        .createProfile(profileSend)
        .subscribe((response: any) => {
          console.log(response);
        });
    }
  }

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm() {
    this.form = this.formBuilder.group({
      resume: ['', Validators.required],
    });
  }
}
