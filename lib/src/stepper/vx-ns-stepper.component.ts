import {
    AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChildren, EventEmitter, forwardRef,
    Input,
    OnDestroy, Output,
    QueryList
} from '@angular/core';
import { VxNsStepComponent } from './step/vx-ns-step.component';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { VX_NS_STEPPER_TOKEN } from "./vx-ns-stepper.token";
import { boundNumber, coerceBooleanProperty } from "../shared/util";

@Component({
        selector: 'vx-ns-stepper',
    templateUrl: './vx-ns-stepper.component.html',
    styleUrls: ['./vx-ns-stepper.component.scss'],
    providers: [{provide: VX_NS_STEPPER_TOKEN, useExisting: forwardRef(() => VxNsStepperComponent)}],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsStepperComponent {
    @ContentChildren(VxNsStepComponent) steps: QueryList<VxNsStepComponent>;

    @Output() selectedStepChange = new EventEmitter<number>();

    private _linear = false;

    @Input()
    get linear(): boolean {
        return this._linear;
    }

    set linear(value: boolean) {
        this._linear = coerceBooleanProperty(value);
        this.cdr.markForCheck();
    }

    private _selectedStep = -1;

    get selectedStep(): number {
        return this._selectedStep;
    }

    @Input()
    set selectedStep(stepIdx: number) {
        stepIdx = boundNumber(+stepIdx || 0, 0, this.steps ? this.steps.length - 1 : 0);
        if (this.steps) {
            const step = this.steps.toArray()[stepIdx];

            if (!step || this._shouldDisable(step, true)) {
                return;
            }
        }

        if (this.selectedStep !== stepIdx) {
            // this.animateStepChange(stepIdx, this.selectedStep);
            this._selectedStep = stepIdx;
            this.selectedStepChange.emit(stepIdx);
            this.cdr.markForCheck();
        }
    }

    constructor(private cdr: ChangeDetectorRef) {
        this.selectedStep = 0;
    }

    ngAfterContentInit(): void {
        this.steps.changes.subscribe(() => {
            this.cdr.markForCheck();
        })
    }

    next(): void {
        this.selectedStep++;
    }

    previous(): void {
        this.selectedStep--;
    }


  /** @--internal */
  _shouldDisable(curStep: VxNsStepComponent, markAsTouched = false): boolean {
    if (!this.linear)
      return false;

    const steps = this.steps.toArray();
    for (const step of steps) {
      if (step === curStep)
        return false;
      else {
        if (markAsTouched)
          step.markAsTouched();

        if (!step.valid())
          return true;
      }
    }
    return false;
  }

  _markForCheck(): void {
      this.cdr.markForCheck();
  }
}
