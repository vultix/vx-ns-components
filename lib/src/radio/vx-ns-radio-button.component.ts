import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { VxNsRadioGroupComponent } from "./vx-ns-radio-group.component";
import { RADIO_GROUP } from "./vx-ns-radio.token";

export interface IVxNsRadioGroupComponent<T> extends VxNsRadioGroupComponent<T> {

}

@Component({
    selector: 'vx-ns-radio-button',
    templateUrl: './vx-ns-radio-button.component.html',
    styleUrls: ['./vx-ns-radio-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsRadioButtonComponent<T> {
    @Input() value?: T; // TODO: strictPropertyInitialization!
    @Input() text?: string;

    // TODO: is there another way to import without circular dependency?
    constructor(@Inject(RADIO_GROUP) public group: IVxNsRadioGroupComponent<T>, private cdr: ChangeDetectorRef) {
    }

    onTap(): void {
        if (this.value)
            this.group._setValue(this.value);
    }

    _markForCheck(): void {
        this.cdr.markForCheck();
    }
}
