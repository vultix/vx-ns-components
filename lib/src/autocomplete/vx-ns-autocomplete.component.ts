import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Optional,
    Output,
    QueryList,
    Self,
    ViewChild
} from "@angular/core";
import { VxNsFormFieldDirective } from "../form-field/vx-ns-form-field.directive";
import { Subject } from "rxjs";
import { isIOS } from "tns-core-modules/platform";
import { VxNsItemComponent } from "../menu/item/vx-ns-item.component";
import { startWith, takeUntil } from "rxjs/operators";
import { coerceBooleanProperty } from "../shared/util";
import { VxNsMenuComponent } from "../menu/vx-ns-menu.component";
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import * as fuzzysort from 'fuzzysort';
import { HorizontalAlignment } from "tns-core-modules/ui/styling/style-properties";

declare const IQKeyboardManager: any;

@Component({
    selector: 'vx-ns-autocomplete',
    templateUrl: './vx-ns-autocomplete.component.html',
    styleUrls: ['./vx-ns-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class VxNsAutocompleteComponent<T = string> implements AfterViewInit, AfterContentInit, OnDestroy, DoCheck, ControlValueAccessor {
    @ViewChild(VxNsFormFieldDirective) field: VxNsFormFieldDirective;
    @ViewChild(VxNsMenuComponent) menu: VxNsMenuComponent<T>;

    @ContentChildren(VxNsItemComponent) items: QueryList<VxNsItemComponent<T>>;

    /** The text to show when there are no items */
    @Input() defaultText = 'No results found.';

    _filteredItems: VxNsItemComponent<T>[] = [];
    invalid: boolean;

    _onChange = (_t: T | T[] | undefined) => {
    };
    _onTouched = () => {
    };

    @Input() placeholder: string;
    @Input() set hint(hint: string) {
        this.placeholder = hint;
    };

    @Output()
    valueChange = new EventEmitter<T | T[] | undefined>();

    @Input() horizontalAlignment: HorizontalAlignment = 'stretch';

    @Output()
    searchChange = new EventEmitter<string>();

    private onDestroy$ = new Subject<void>();
    private iqKeyboard: any;
    private keyedItems: Map<T, VxNsItemComponent<T>> = new Map();
    private textChangedManually = false;

    constructor(
      private el: ElementRef,
      private cdr: ChangeDetectorRef,
      @Optional() @Self() public ngControl: NgControl,
      @Optional() private _parentForm: NgForm,
      @Optional() private _parentFormGroup: FormGroupDirective) {

        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }

        if (this.ngControl && this.ngControl.valueChanges) {
            this.ngControl.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                this.checkIsInvalid();
            })
        }

        if (isIOS && IQKeyboardManager) {
            this.iqKeyboard = IQKeyboardManager.sharedManager();
            this.iqKeyboard.keyboardDistanceFromTextField = 200;
        }

    }

    get _selectedItems(): VxNsItemComponent<T>[] {
        if (this.multiple) {
            return (this.value as T[]).map(value => this.getItemByValue(value)!);
        } else {
            return [];
        }
    }

    private _required = false;

    get required(): boolean {
        return this._required;
    }

    @Input()
    set required(required: boolean) {
        required = coerceBooleanProperty(required);
        if (required !== this._required) {
            this._required = required;
            this.cdr.markForCheck();
        }
    }

    private _disabled = false;

    get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    set disabled(disabled: boolean) {
        disabled = coerceBooleanProperty(disabled);
        if (disabled !== this._disabled) {
            this._disabled = disabled;
            this.cdr.markForCheck();
        }
    }

    private _multiple = false;

    get multiple(): boolean {
        return this._multiple;
    }

    @Input()
    set multiple(multiple: boolean) {
        multiple = coerceBooleanProperty(multiple);
        if (multiple !== this._multiple) {
            this._multiple = multiple;

            this.value = multiple ? [] : undefined;

            this.cdr.markForCheck();
        }
    }

    private _value?: T | T[];

    get value(): T | T[] | undefined {
        return this._value;
    }

    @Input()
    set value(value: T | T[] | undefined) {
        if (value !== this._value) {
            this._value = value;

            this._filter();
            this._repopulateValue();

            this.cdr.markForCheck();
        }
    }

    ngAfterViewInit(): void {
        this.field.stateChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    ngAfterContentInit(): void {
        this.items.changes.pipe(startWith(null)).subscribe(() => {
            this.keyedItems.clear();
            this.items.forEach(item => {
                this.keyedItems.set(item.value, item);
            });

            this._filter();
        });
    }

    _filter(): void {
        if (!this.items) {
            return;
        }

        const filterText = this.field.value;
        if (!filterText || !filterText.length) {
            this._filteredItems = this.items.toArray();
        } else {
            const filtered = fuzzysort.go<VxNsItemComponent<T>>(filterText, this.items.toArray(), {
                key: 'text'
            });
            this._filteredItems = filtered.map(item => item.obj);
        }

        if (this.multiple) {
            this._filteredItems = this._filteredItems.filter(item => {
                // Don't show already selected items
                return !(this.value as T[]).includes(item.value);
            })
        }

        this.cdr.markForCheck();
    }

    _showMenu(): void {
        if (!this.menu.visible) {
            this.menu.visible = true;
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    ngDoCheck(): void {
        this.checkIsInvalid();
    }

    _selectItem(value: T): void {
        if (this.multiple) {
            this.value = [...(this.value as T[]), value];
        } else {
            this.value = value;
        }

        this.valueChange.emit(this.value);
        this._onChange(this.value);
        this._onTouched();
    }

    _removeItem(value: T): void {
        if (this.multiple) {
            this.value = (this.value as T[]).filter(item => item !== value);
        }

        this._onTouched();
        this.valueChange.emit(this.value);
        this._onChange(this.value);

        //Timeout to allow the field to be focused
        setTimeout(() => {
            this.menu.visible = false;
        });
    }


    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: T): void {
        this.value = obj;
        this.valueChange.emit(this.value);
    }

    focus(): void {
        this.field.focus();
    }

    blur(): void {
        this.field.blur();
    }

    _dropdownVisible(visible: boolean) {
        if (!visible) {
            this._repopulateValue();
        }
    }

    _handleTap(): void {
        if (!this.menu.visible) {
            if (this.field.value !== '') {
                this.textChangedManually = true;
                this.field.value = '';
            }

            this.menu.visible = true;
        }
    }

    _textChanged(): void {
        if (this.textChangedManually) {
            this.textChangedManually = false;
            return;
        }
        this.searchChange.emit(this.field.value);
        this._filter();
        this._showMenu();
    }

    private getItemByValue(val: T): VxNsItemComponent<T> | undefined {
        if (!this.items || !val)
            return;

        return this.keyedItems.get(val);
    }

    /** Whether the input is in an error state. */
    private checkIsInvalid(): void {
        let invalid = false;
        const control = this.ngControl;
        const form = this._parentFormGroup || this._parentForm;
        if (control) {
            const isSubmitted = form && form.submitted;
            invalid = !!(control.invalid && (control.touched || isSubmitted));
        }

        if (invalid !== this.invalid) {
            this.invalid = invalid;
            this.cdr.markForCheck();
        }
    }

    private _repopulateValue(): void {
        let value;
        if (this.value && !this.multiple)
            value = this.getItemByValue(this.value as T)!.text;
        else
            value = '';

        if (value !== this.field.value) {
            this.textChangedManually = true;
            this.field.value = value;
        }

    }
}