import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { VxNsStepperComponent } from './vx-ns-stepper.component';
import { VxNsStepComponent } from './step/vx-ns-step.component';
import { VxNsStepHeaderComponent } from './step-header/vx-ns-step-header.component';
import { VxNsStepBodyComponent } from './step-body/vx-ns-step-body.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VxNsStepperNextDirective, VxNsStepperPreviousDirective } from './vx-ns-stepper.directives';

@NgModule({
  imports: [
    NativeScriptCommonModule
  ],
  declarations: [
    VxNsStepperComponent, VxNsStepComponent, VxNsStepperNextDirective, VxNsStepperPreviousDirective, VxNsStepHeaderComponent, VxNsStepBodyComponent
  ],
  exports: [
    VxNsStepperComponent, VxNsStepComponent, VxNsStepperNextDirective, VxNsStepperPreviousDirective
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsStepperModule {}
