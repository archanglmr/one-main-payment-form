import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private numbersOnlyValidator = Validators.pattern('^[0-9]*$');

  protected readonly AccountType = AccountType;
  protected form = new FormGroup({
    loanNumber: new FormControl('', [this.numbersOnlyValidator, Validators.required]),
    accountType: new FormControl(AccountType.Checking),

    checkingRoutingNumber: new FormControl('', [this.numbersOnlyValidator]),
    checkingBankAccountNumber: new FormControl('', [this.numbersOnlyValidator]),
    checkingConfirmBankAccountNumber: new FormControl('', [this.numbersOnlyValidator]),


    ccCardNumber: new FormControl('', [this.numbersOnlyValidator]),
    ccNameOnCard: new FormControl(''),
    ccExpiration: new FormControl(''),
    ccCVV: new FormControl('', [this.numbersOnlyValidator, Validators.minLength(3), Validators.maxLength(3)]),
  });

  ngOnInit() {
    this.form.controls.accountType.valueChanges.subscribe((value) => {
      switch (value) {
        case AccountType.Checking:
          this.form.controls.checkingRoutingNumber.addValidators([Validators.required])
          this.form.controls.checkingBankAccountNumber.addValidators([Validators.required])
          this.form.controls.checkingConfirmBankAccountNumber.addValidators([Validators.required])

          this.form.controls.ccCardNumber.removeValidators([Validators.required])
          this.form.controls.ccNameOnCard.removeValidators([Validators.required])
          this.form.controls.ccExpiration.removeValidators([Validators.required])
          this.form.controls.ccCVV.removeValidators([Validators.required])
          break;

        case AccountType.Debit:
          this.form.controls.checkingRoutingNumber.removeValidators([Validators.required])
          this.form.controls.checkingBankAccountNumber.removeValidators([Validators.required])
          this.form.controls.checkingConfirmBankAccountNumber.removeValidators([Validators.required])

          this.form.controls.ccCardNumber.addValidators([Validators.required])
          this.form.controls.ccNameOnCard.addValidators([Validators.required])
          this.form.controls.ccExpiration.addValidators([Validators.required])
          this.form.controls.ccCVV.addValidators([Validators.required])
          break;
      }
    });
  }

  ngOnDestroy() {
      this.subscriptions.unsubscribe();
  }

  submit() {
    console.log(this.form.value);
    console.log(this.form.errors)
  }

}


enum AccountType {
  Checking,
  Debit
}