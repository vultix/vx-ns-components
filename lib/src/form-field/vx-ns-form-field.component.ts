import {
    AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChild, ElementRef, EventEmitter, Input,
    OnDestroy, Output,
    ViewChild
} from "@angular/core";
import { VxNsFormFieldDirective } from "./vx-ns-form-field.directive";
import { Subscription } from "rxjs";
import { HorizontalAlignment } from "tns-core-modules/ui/styling/style-properties";

@Component({
    selector: 'vx-ns-form-field',
    templateUrl: './vx-ns-form-field.component.html',
    styleUrls: ['./vx-ns-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsFormFieldComponent implements AfterContentInit, OnDestroy {
    @ContentChild(VxNsFormFieldDirective) field: VxNsFormFieldDirective;


    @Input() horizontalAlignment: HorizontalAlignment = 'stretch';

    @Input() _invalid = false;

    @Output() tap = new EventEmitter();
    private subscription?: Subscription;

    constructor(private cdr: ChangeDetectorRef, public _el: ElementRef) {}

    ngAfterContentInit(): void {
        if (!this.field) {
            throw new Error('vx-ns-form-field without a vxNsFirmField directive');
        }
        this.subscription = this.field.stateChanges.subscribe(() => {
            this.cdr.markForCheck();
        })
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    _handleTap(): void {
        this.field.focus();
        this.tap.emit();
    }
}