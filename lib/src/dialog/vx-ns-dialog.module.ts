import {NgModule, NO_ERRORS_SCHEMA, Type} from '@angular/core';
import {VxNsDialogComponent} from './vx-ns-dialog.component';
import {VxNsDialog} from './vx-ns-dialog.service';
import {NativeScriptCommonModule} from 'nativescript-angular/common';
import {VxNsLoadingIndicatorComponent} from './loading-indicator/vx-ns-loading-indicator.component';
import {
    VxNsDialogActionsDirective,
    VxNsDialogContentDirective,
    VxNsDialogTitleDirective
} from './vx-ns-dialog.directives';


const directives = [VxNsDialogTitleDirective,
    VxNsDialogContentDirective,
    VxNsDialogActionsDirective];

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [VxNsDialogComponent, VxNsLoadingIndicatorComponent, ...directives],
    entryComponents: [VxNsDialogComponent, VxNsLoadingIndicatorComponent],
    providers: [VxNsDialog],
    exports: [...directives],
    schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsDialogModule {

}