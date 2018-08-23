import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormControl, NgModel } from '@angular/forms';
import { Subscription } from "rxjs";
import { VX_NS_STEPPER_TOKEN } from "../vx-ns-stepper.token";
import { VxNsStepperComponent } from "../vx-ns-stepper.component";

interface IVxNsStepperComponent extends VxNsStepperComponent {

}

@Component({
    selector: 'vx-ns-step',
    template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>`,
    styleUrls: ['./vx-ns-step.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsStepComponent implements OnDestroy, OnChanges {
    @Input() label?: string;
    @Input() invalid = false;
    @ViewChild(TemplateRef) _template: TemplateRef<any>;

    private subscription?: Subscription;

    constructor(@Inject(VX_NS_STEPPER_TOKEN) private stepper: IVxNsStepperComponent) {

    }


    private _stepControl?: AbstractControlDirective | AbstractControl | NgModel;

    get stepControl(): AbstractControlDirective | AbstractControl | NgModel | undefined {
        return this._stepControl;
    }

    @Input()
    set stepControl(value: AbstractControlDirective | AbstractControl | NgModel | undefined) {
        this._stepControl = value;

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }

        if (value && value.valueChanges) {
            this.subscription = value.valueChanges.subscribe(() => {
                this.stepper._markForCheck();
            });
        }
    }

    valid(): boolean {
        return this.invalid || (this._stepControl ? !!this._stepControl.valid : true);
    }

    /** @--internal */
    markAsTouched(): void {
        const control = this.getControl();
        if (control) {
            markAllTouched(control);
        }
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe()
    }

    ngOnChanges(): void {
        // All changes to the steps inputs affect the step header. Have the parent component re-check.
        this.stepper._markForCheck();
    }

    private getControl(): AbstractControl | undefined {
        let control: AbstractControl | undefined;
        if (this.stepControl instanceof NgModel || this.stepControl instanceof AbstractControlDirective) {
            if (this.stepControl.control) {
                control = this.stepControl.control;
            }
        } else {
            control = this.stepControl;
        }
        return control;
    }
}

function markAllTouched(control: AbstractControl): void {
    if (!('markAsTouched' in control))
        return;

    if (control.hasOwnProperty('controls')) {
        control.markAsTouched(); // mark group
        const ctrl = control as any;
        for (const inner in ctrl.controls) {
            if (ctrl.controls.hasOwnProperty(inner))
                markAllTouched(ctrl.controls[inner] as AbstractControl);
        }
    } else {
        (control as FormControl).markAsTouched();
    }
}
