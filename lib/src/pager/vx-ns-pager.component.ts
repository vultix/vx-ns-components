import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren, ElementRef,
    forwardRef,
    Input,
    QueryList, ViewChild
} from '@angular/core';
import { startWith } from 'rxjs/operators';
import { VxNsPageComponent } from './vx-ns-page.component';
import { VX_NS_PAGER_TOKEN } from './vx-ns-pager.token';
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout";

@Component({
    selector: 'vx-ns-pager',
    template: `
        <AbsoluteLayout #container class="vx-ns-pager">
            <ng-content></ng-content>
        </AbsoluteLayout>
    `,
    styleUrls: ['./vx-ns-pager.component.scss'],
    providers: [{provide: VX_NS_PAGER_TOKEN, useExisting: forwardRef(() => VxNsPagerComponent)}],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsPagerComponent implements AfterContentInit {
    @ContentChildren(VxNsPageComponent, {descendants: true}) pages: QueryList<VxNsPageComponent>;
    @ViewChild('container') _container: ElementRef<AbsoluteLayout>;

    private previousIndex = 0;
    private initialized = false;

    constructor(private cdr: ChangeDetectorRef) {
    }

    private _selectedPage = 0;

    @Input()
    get selectedPage(): number {
        return this._selectedPage;
    }

    set selectedPage(value: number) {
        if (this._selectedPage !== value) {
            this.previousIndex = this.selectedPage;

            this._selectedPage = +value || 0;
            this.ensureSelectedPage();
            this.cdr.markForCheck();
        }
    }

    ngAfterContentInit(): void {
        this.pages.changes.pipe(startWith(null)).subscribe(() => {
            this.ensureSelectedPage();
            this.cdr.markForCheck();
        })
    }

    next(): void {
        this.selectedPage++;
    }

    previous(): void {
        this.selectedPage--;
    }

    /** Ensures that we have the correct tab selected */
    private ensureSelectedPage(): void {
        if (this.pages && this.pages.length) {
            if (this.selectedPage < 0) {
                this.selectedPage = 0;
                return;
            } else if (this.selectedPage >= this.pages.length) {
                this.selectedPage = this.pages.length - 1;
                return;
            }

            const selectedPage = this.selectedPage;

            this.pages.forEach((tb, idx) => {
                tb._left = idx < selectedPage;
                tb._right = idx > selectedPage;
                tb._current = idx === selectedPage;

                const tbEl = tb._container.nativeElement;
                const thisEl = this._container.nativeElement;
                if (idx === selectedPage && tbEl && thisEl) {
                    setTimeout(() => {
                        thisEl.style.height = tbEl.getActualSize().height;
                    }, 10);

                    setTimeout(() => {
                        thisEl.style.height = 'auto';
                    }, 310); // After the animation
                }

            });

            this.initialized = true;
        }
    }
}
