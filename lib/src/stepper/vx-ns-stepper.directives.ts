import { Directive, Inject } from '@angular/core';
import { VxNsStepperComponent } from './vx-ns-stepper.component';
import { VX_NS_STEPPER_TOKEN } from "./vx-ns-stepper.token";

@Directive({
  selector: '[vxNsStepperPrevious], [vxNsStepperBack]',
  host: {
    '(tap)': '_stepper.previous()'
  }
})
export class VxNsStepperPreviousDirective {
  constructor(@Inject(VX_NS_STEPPER_TOKEN) public _stepper: VxNsStepperComponent) {}
}

@Directive({
  selector: '[vxNsStepperNext]',
  host: {
    '(tap)': '_stepper.next()'
  }
})
export class VxNsStepperNextDirective {
  constructor(@Inject(VX_NS_STEPPER_TOKEN) public _stepper: VxNsStepperComponent) {}
}
