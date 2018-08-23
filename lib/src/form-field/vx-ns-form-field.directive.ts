import {
    ChangeDetectorRef,
    Directive,
    DoCheck,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Renderer2,
    Self
} from "@angular/core";
import { coerceBooleanProperty } from "../shared/util";
import { FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import { TextField } from "tns-core-modules/ui/text-field";
import { TextView } from "tns-core-modules/ui/text-view";
import { Subject, Subscription } from "rxjs";

type FormField = TextField | TextView;

@Directive({
    selector: 'TextField[vxNsFormField], TextView[vxNsFormField]',
    host: {
        '(blur)': '_focusChanged(false)',
        '(focus)': '_focusChanged(true)',
        '[class.vx-ns-form-field]': 'true',
        '[class.show-hint]': '_showHint'

    }
})
export class VxNsFormFieldDirective implements OnChanges, OnDestroy, DoCheck {

    @Input('hint')
    get hint(): string {
        return this.placeholder;
    }
    set hint(hint: string) {
        this.placeholder = hint;
    }

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.handlePlaceholder();
    }
    private _placeholder: string;

    @Input()
    get label(): string {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this.handlePlaceholder();
    }
    private _label: string;

    @Input()
    set value(value: string) {
        this.el.nativeElement.text = value;
    }
    get value(): string {
        return this.el.nativeElement.text;
    }

    @Input()
    get disabled(): boolean {
        if (this.ngControl && this.ngControl.disabled !== null) {
            return this.ngControl.disabled || this._disabled;
        }
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.el.nativeElement.isEnabled = !this._disabled;
    }
    protected _disabled = false;

    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) { this._required = coerceBooleanProperty(value); }
    private _required = false;

    @Input() requiredLabel = false;


    focused = false;

    invalid = false;

    _showHint = false;

    readonly stateChanges = new Subject();

    private subscription?: Subscription;

    constructor(
      private el: ElementRef<FormField>,
      @Optional() @Self() public ngControl: NgControl,
      @Optional() private _parentForm: NgForm,
      @Optional() private _parentFormGroup: FormGroupDirective,
      private cdr: ChangeDetectorRef) {

        if (this.ngControl && this.ngControl.valueChanges) {
            this.subscription = this.ngControl.valueChanges.subscribe(() => {
                this.checkIsInvalid();
            })
        }

    }

    focus(): void {
        this.el.nativeElement.focus();
    }

    blur(): void {
        this.el.nativeElement.dismissSoftInput();
        this._focusChanged(false);
    }

    _focusChanged(isFocused: boolean): void {
        if (isFocused !== this.focused) {
            this.focused = isFocused;
            this.stateChanges.next();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }

    ngOnChanges(): void {
        this.stateChanges.next();
    }

    ngDoCheck(): void {
        this.checkIsInvalid();
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
            this.stateChanges.next();
        }
    }

    private handlePlaceholder(): void {
        this.el.nativeElement.hint = this.placeholder || this.label || '';
        this._showHint = !!this.placeholder && !!this.label;
        this.cdr.markForCheck();
    }
}