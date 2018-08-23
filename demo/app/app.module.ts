import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { AppComponent } from "./app.component";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { VxNsComponentsModule } from "../../lib/src/vx-ns-components.module";
import { NativeScriptFormsModule, registerElement } from "nativescript-angular";
import { CustomErrorHandler } from "./custom-error-handler";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./home/home.component";
import { MenuDemoComponent } from "./menu-demo/menu-demo.component";
import { StepperDemoComponent } from "./stepper-demo/stepper-demo.component";
import { FormFieldDemoComponent } from "./form-field-demo/form-field-demo.component";
import { RadioDemoComponent } from "./radio-demo/radio-demo.component";
import { AutocompleteDemoComponent } from "./autocomplete-demo/autocomplete-demo.component";
registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);
@NgModule({
    imports: [NativeScriptModule, VxNsComponentsModule, NativeScriptFormsModule, AppRoutingModule],
    declarations: [AppComponent, HomeComponent, MenuDemoComponent, StepperDemoComponent, FormFieldDemoComponent, RadioDemoComponent, AutocompleteDemoComponent],
    bootstrap: [AppComponent],
    providers: [{provide: ErrorHandler, useClass: CustomErrorHandler}],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {

}