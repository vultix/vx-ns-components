import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { VxNsRadioModule } from "./radio/vx-ns-radio.module";
import { VxNsPagerModule } from "./pager/vx-ns-pager.module";
import { VxNsStepperModule } from "./stepper/vx-ns-stepper.module";
import { VxNsMenuModule } from "./menu/vx-ns-menu.module";
import { VxNsFormFieldModule } from "./form-field/vx-ns-form-field.module";
import { VxNsAutocompleteModule } from "./autocomplete/vx-ns-autocomplete.module";

const modules = [VxNsRadioModule, VxNsPagerModule, VxNsStepperModule, VxNsMenuModule, VxNsFormFieldModule, VxNsAutocompleteModule];
@NgModule({
    imports: [...modules],
    exports: [...modules]
})
export class VxNsComponentsModule {

}