import { NgModule, NO_ERRORS_SCHEMA, SchemaMetadata } from '@angular/core';
import { VxNsPagerComponent } from './vx-ns-pager.component';
import { CommonModule } from '@angular/common';
import { VxNsPageComponent } from './vx-ns-page.component';
import { VxPagerNextDirective, VxPagerPreviousDirective } from './vx-ns-pager.directives';

@NgModule({
    imports: [CommonModule],
    declarations: [VxNsPagerComponent, VxNsPageComponent, VxPagerNextDirective, VxPagerPreviousDirective],
    exports: [VxNsPagerComponent, VxNsPageComponent, VxPagerNextDirective, VxPagerPreviousDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class VxNsPagerModule {

}
