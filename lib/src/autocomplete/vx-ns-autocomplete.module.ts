import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VxNsFormFieldModule } from "../form-field/vx-ns-form-field.module";
import { VxNsMenuModule } from "../menu/vx-ns-menu.module";
import { VxNsAutocompleteComponent } from "./vx-ns-autocomplete.component";
import { VxNsItemComponent } from "../menu/item/vx-ns-item.component";

@NgModule({
    imports: [
        CommonModule,
        VxNsFormFieldModule,
        VxNsMenuModule
    ],
    declarations: [
        VxNsAutocompleteComponent
    ],
    exports: [
        VxNsAutocompleteComponent, VxNsItemComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsAutocompleteModule {

}