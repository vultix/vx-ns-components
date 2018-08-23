import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { coerceBooleanProperty } from '../../shared/util';
import { TouchGestureEventData } from "tns-core-modules/ui/gestures";
import { VX_NS_MENU_TOKEN } from "../vx-ns-menu.token";
import { VxNsMenuComponent } from "../vx-ns-menu.component";

interface IVxNsMenuComponent<T> extends VxNsMenuComponent<T> {

}

@Component({
    selector: 'vx-ns-item',
    templateUrl: './vx-ns-item.component.html',
    styleUrls: ['./vx-ns-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsItemComponent<T = string> {
    active: boolean;

    @Output() onSelect = new EventEmitter();
    @Input() text: string;

    private _disabled: boolean;

    get disabled(): boolean {
        return this._disabled;
    }

    @Input() set disabled(val: boolean) {
        this._disabled = coerceBooleanProperty(val);
    }

    private _value: T;

    @Input() get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
    }

    constructor(@Inject(VX_NS_MENU_TOKEN) @Optional() private menu?: IVxNsMenuComponent<T>) {}

    handleTap(): void {
        if (!this.disabled) {
            this.onSelect.emit();

            if (this.menu) {
                this.menu.itemSelect.next(this.value);

                if (this.menu.autoClose) {
                    this.menu.visible = false;
                }
            }
        }
    }

    handleTouch(event: TouchGestureEventData): void {
        if (this.disabled) {
            this.active = false;
            return;
        }

        this.active = event.action === 'down' || event.action === 'move';
    }
}
