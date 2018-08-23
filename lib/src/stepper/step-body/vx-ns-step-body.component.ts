import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    NgZone,
    ViewChild
} from '@angular/core';
import { VxNsStepComponent } from '../step/vx-ns-step.component';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { ScrollView } from 'tns-core-modules/ui/scroll-view';
import { map } from 'rxjs/operators';
import { createAnimation, EasingFunctions } from "../../shared";
import { isIOS } from "tns-core-modules/platform";

@Component({
    selector: 'vx-ns-step-body',
    templateUrl: './vx-ns-step-body.component.html',
    styleUrls: ['./vx-ns-step-body.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsStepBodyComponent implements AfterContentInit {
    @Input() step: VxNsStepComponent;
    @Input() last: boolean;

    @ViewChild('content') content: ElementRef<StackLayout>;
    @ViewChild('container') container: ElementRef<ScrollView>;
    private initialized = false;

    constructor(private zone: NgZone) {
    }

    private _active: boolean;

    @Input()
    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        if (value !== this._active) {
            this._active = value;
            if (this.initialized) {
                this.animate();
            }
        }
    }

    ngAfterContentInit(): void {
        setTimeout(() => {
            const container: ScrollView = this.container.nativeElement;
            const content: StackLayout = this.content.nativeElement;
            if (this.active) {
                container.height = 'auto';
            }

            if (isIOS) {
                container.ios.scrollEnabled = false;
            }

            this.initialized = true;
        }, 100);
    }

    animate() {
        console.log('About to animate!');
        const content = this.content.nativeElement;
        const container = this.container.nativeElement;
        const openHeight = content.getActualSize().height;
        const curHeight = container.getActualSize().height;
        const diff = this.active ? openHeight - curHeight : -curHeight;
        this.zone.runOutsideAngular(() => {
            const startTime = Date.now();
            createAnimation(300, EasingFunctions.easeInOutQuad)
              .pipe(map(t => t * diff))
              .subscribe(amount => {
                  container.height = curHeight + amount;
              });
        });
    }
}
