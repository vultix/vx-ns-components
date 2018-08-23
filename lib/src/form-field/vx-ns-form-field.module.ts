import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { VxNsFormFieldComponent } from "./vx-ns-form-field.component";
import { CommonModule } from "@angular/common";
import { VxNsFormFieldDirective } from "./vx-ns-form-field.directive";

@NgModule({
    imports: [CommonModule],
    declarations: [VxNsFormFieldComponent, VxNsFormFieldDirective],
    exports: [VxNsFormFieldComponent, VxNsFormFieldDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsFormFieldModule {

}