import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    QueryList
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VxNsRadioButtonComponent } from './vx-ns-radio-button.component';
import { RADIO_GROUP } from "./vx-ns-radio.token";

@Component({
    selector: 'vx-ns-radio-group',
    template: `
        <StackLayout>
            <ng-content></ng-content>
        </StackLayout>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => VxNsRadioGroupComponent),
            multi: true
        },
        {
            provide: RADIO_GROUP,
            useExisting: forwardRef(() => VxNsRadioGroupComponent)
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsRadioGroupComponent<T> implements ControlValueAccessor {
    @ContentChildren(forwardRef(() => VxNsRadioButtonComponent))
    buttons?: QueryList<VxNsRadioButtonComponent<T>>; // TODO: strictPropertyInitialization!

    @Output() valueChange = new EventEmitter<T>();
    private onTouchFn = () => {
    };
    private onChangeFn = (val: T) => {
    };

    constructor(private cdr: ChangeDetectorRef) {
    }

    private _value?: T;

    get value(): T | undefined {
        return this._value;
    }

    @Input()
    set value(value: T | undefined) {
        if (value !== this._value) {
            this._value = value;
            this.cdr.markForCheck();
            if (this.buttons)
                this.buttons.forEach(button => button._markForCheck());
        }
    }


    _setValue(value: T): void {
        this._value = value;
        this.valueChange.emit(value);

        this.onChangeFn(value);
        this.onTouchFn();

        this.buttons!.forEach(button => button._markForCheck());
    }

    writeValue(obj: T): void {
        this.value = obj;
        this.valueChange.emit(obj);
    }

    registerOnChange(fn: (val: T) => any): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchFn = fn;
    }
}