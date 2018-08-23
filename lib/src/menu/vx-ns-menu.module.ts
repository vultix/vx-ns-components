import { Component, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VxNsMenuComponent } from "./vx-ns-menu.component";
import { VxNsItemComponent } from "./item/vx-ns-item.component";
import { VxNsMenuTriggerDirective } from "./vx-ns-menu-trigger.directive";
import { VxNsAttachMenuDirective } from "./vx-ns-attach-menu.directive";

@NgModule({
    imports: [CommonModule],
    declarations: [VxNsMenuComponent, VxNsItemComponent, VxNsMenuTriggerDirective, VxNsAttachMenuDirective],
    exports: [VxNsMenuComponent, VxNsItemComponent, VxNsMenuTriggerDirective, VxNsAttachMenuDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsMenuModule {

}