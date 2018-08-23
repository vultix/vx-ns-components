import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "./home/home.component";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { MenuDemoComponent } from "./menu-demo/menu-demo.component";
import { StepperDemoComponent } from "./stepper-demo/stepper-demo.component";
import { FormFieldDemoComponent } from "./form-field-demo/form-field-demo.component";
import { RadioDemoComponent } from "./radio-demo/radio-demo.component";
import { AutocompleteDemoComponent } from "./autocomplete-demo/autocomplete-demo.component";


const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: 'menu-demo', component: MenuDemoComponent},
    { path: 'stepper-demo', component: StepperDemoComponent},
    { path: 'form-field-demo', component: FormFieldDemoComponent},
    { path: 'radio-demo', component: RadioDemoComponent},
    { path: 'autocomplete-demo', component: AutocompleteDemoComponent}
];

@NgModule({
    imports: [NativeScriptModule, NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
