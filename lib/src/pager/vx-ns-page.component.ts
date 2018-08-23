import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";

@Component({
    selector: 'vx-ns-page',
    template: `
        <StackLayout #container>
            <ng-content></ng-content>
        </StackLayout>`,
    styleUrls: ['./vx-ns-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsPageComponent {
    @ViewChild('container') _container: ElementRef<StackLayout>;
    _left = false;
    _right = false;
    private initialized = false;

    set _current(current: boolean) {
        const el = this._container.nativeElement;
        const width = el.getActualSize().width;
        const newX = current ? 0 : (this._left ? -width : width);

        if (!this.initialized) {
            this.initialized = true;
            el.style.translateX = newX;
            return;
        }
        el.height = "auto";

        el.animate({
            translate: {
                x: newX,
                y: 0
            },
            duration: 300
        }).then(() => {
            el.height = current ? "auto" : 0;
        })
    };

}
