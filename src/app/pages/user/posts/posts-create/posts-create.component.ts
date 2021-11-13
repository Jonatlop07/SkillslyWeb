import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent implements OnInit {
  allowedTypes = '^imagen$|^video$';
  postForm: FormGroup;
  formGroup: FormGroup;
  invalidRequiredFormat = false;
  requireOne = false;
  referenceIncomplete = false;
  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.postForm = new FormGroup({
      content: new FormArray([
        new FormGroup({
          description: new FormControl(null, Validators.maxLength(250)),
          reference: new FormGroup({
            reference_url: new FormControl(null),
            reference_type: new FormControl(null, [
              Validators.pattern(`${this.allowedTypes}`),
            ]),
          }),
        }),
      ]),
    });
  }

  get controls() {
    return (<FormArray>this.postForm.get('content')).controls;
  }

  onAddContent() {
    (<FormArray>this.postForm.get('content')).push(
      new FormGroup({
        description: new FormControl(null, Validators.maxLength(250)),
        reference: new FormGroup({
          reference_url: new FormControl(null),
          reference_type: new FormControl(null, [
            Validators.pattern(`${this.allowedTypes}`),
          ]),
        }),
      })
    );
  }

  onDeleteContent(index: number) {
    (<FormArray>this.postForm.get('content')).removeAt(index);
  }

  onCancel() {
    console.log(this.postForm);
    return false;
  }

  onSubmit() {
    const controls = (<FormArray>this.postForm.get('content')).controls;
    if (this.validateContent(controls)) {
      this.referenceIncomplete = false;
      this.requireOne = false;
      console.log('submited!');

      return true;
    } else {
      return false;
    }
  }

  validateContent(controls: AbstractControl[]) {
    for (const control of controls) {
      if (
        !control.get('description').value &&
        !control.get('reference.reference_url').value &&
        !control.get('reference.reference_type').value
      ) {
        control.get('description').addValidators([Validators.required]);
        this.requireOne = true;
        return false;
      }
      if (
        (!control.get('reference.reference_url').value &&
          control.get('reference.reference_type').value) ||
        (control.get('reference.reference_url').value &&
          !control.get('reference.reference_type').value)
      ) {
        control
          .get('reference')
          .get('reference_url')
          .addValidators([Validators.required]);
        control
          .get('reference')
          .get('reference_type')
          .addValidators([Validators.required]);
        this.referenceIncomplete = true;
        return false;
      }
    }
    return true;
  }
}
