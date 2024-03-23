import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription, startWith } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private numbersOnlyValidator = Validators.pattern(/^\d+$/);
  private defaultAccountType = AccountType.Checking;

  protected readonly AccountType = AccountType;
  protected form = new FormGroup({
    loanNumber: new FormControl('', [Validators.required, this.numbersOnlyValidator]),
    accountType: new FormControl(this.defaultAccountType, [Validators.required]),

    checkingRoutingNumber: new FormControl(''),
    checkingBankAccountNumber: new FormControl(''),
    checkingConfirmBankAccountNumber: new FormControl(''),

    ccCardNumber: new FormControl(''),
    ccNameOnCard: new FormControl(''),
    ccExpiration: new FormControl(''),
    ccCVV: new FormControl(''),
  });

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions.add(
      this.form.controls.accountType.valueChanges
        .pipe(startWith(this.defaultAccountType))
        .subscribe(
          (value) => {


            this.form.controls.ccCardNumber.clearValidators();
            this.form.controls.ccCardNumber.setErrors(null, {emitEvent: false});

            this.form.controls.ccNameOnCard.clearValidators();
            this.form.controls.ccNameOnCard.setErrors(null, {emitEvent: false});

            this.form.controls.ccExpiration.clearValidators();
            this.form.controls.ccExpiration.setErrors(null, {emitEvent: false});

            this.form.controls.ccCVV.clearValidators();
            this.form.controls.ccCVV.setErrors(null, { emitEvent: false });

            this.form.controls.checkingRoutingNumber.clearValidators();
            this.form.controls.checkingRoutingNumber.setErrors(null, {emitEvent: false});

            this.form.controls.checkingBankAccountNumber.clearValidators();
            this.form.controls.checkingBankAccountNumber.setErrors(null, {emitEvent: false});

            this.form.controls.checkingConfirmBankAccountNumber.clearValidators();
            this.form.controls.checkingConfirmBankAccountNumber.setErrors(null, {emitEvent: false});

            switch (value) {
              case AccountType.Checking:
                this.form.controls.checkingRoutingNumber.addValidators([Validators.required, this.numbersOnlyValidator, Validators.maxLength(9)])
                this.form.controls.checkingBankAccountNumber.addValidators([Validators.required, this.numbersOnlyValidator])
                this.form.controls.checkingConfirmBankAccountNumber.addValidators([Validators.required, this.numbersOnlyValidator])
                break;

              case AccountType.Debit:
                this.form.controls.ccCardNumber.addValidators([Validators.required, this.numbersOnlyValidator])
                this.form.controls.ccNameOnCard.addValidators([Validators.required])
                this.form.controls.ccExpiration.addValidators([Validators.required])
                this.form.controls.ccCVV.addValidators([Validators.required, this.numbersOnlyValidator, Validators.minLength(3), Validators.maxLength(3)])
                break;
            }
            this.changeDetection.detectChanges()
          }
      )
    );
  }

  ngOnDestroy() {
      this.subscriptions.unsubscribe();
  }

  submit() {
    console.log(this.form.value);
    switch (this.form.value.accountType) {
      case AccountType.Checking:
        console.log('Checking Account');
        console.log('Loan Account Number: ' + this.form.value.loanNumber);
        console.log('Routing Number: ' + this.form.value.checkingRoutingNumber);
        console.log('Bank Account Number: ' + this.form.value.checkingBankAccountNumber);
        break;

      case AccountType.Debit:
        console.log('Debit Card');
        console.log('Loan Account Number: ' + this.form.value.loanNumber);
        console.log('Card Number: ' + this.form.value.ccCardNumber);
        console.log('Name on Card: ' + this.form.value.ccNameOnCard);
        console.log('Expiration: ' + this.form.value.ccExpiration);
        console.log('CVV: ' + this.form.value.ccCVV);
        break;
    }
    alert('See javascript console for details')
  }

}


enum AccountType {
  Checking,
  Debit
}