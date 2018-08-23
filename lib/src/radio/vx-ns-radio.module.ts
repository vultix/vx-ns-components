import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VxNsRadioButtonComponent } from './vx-ns-radio-button.component';
import { VxNsRadioGroupComponent } from './vx-ns-radio-group.component';

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [VxNsRadioButtonComponent, VxNsRadioGroupComponent],
  exports: [VxNsRadioButtonComponent, VxNsRadioGroupComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsRadioModule {}
