import {ChangeDetectionStrategy, Component, Inject, Injector, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {_VX_NS_DIALOG_OPTIONS} from './dialog.tokens';
import {VxNsDialogOptions, VxNsDialogComponentOptions} from './vx-ns-dialog.service';
import {Page} from 'tns-core-modules/ui/page';

@Component({
    templateUrl: './vx-ns-dialog.component.html',
    styleUrls: ['./vx-ns-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // providers: [
    //     {provide: forwardRef(() => VxNsLoadingIndicatorComponent), useExisting: forwardRef(() => VxNsLoadingIndicatorComponent)}
    // ]
})
export class VxNsDialogComponent {
    private onCloseSubject = new Subject<any>();

    onClose = this.onCloseSubject.asObservable();

    _childInjector: Injector;
    private dialogTapped = false;
    constructor(@Inject(_VX_NS_DIALOG_OPTIONS) public options: any, private page: Page, injector: Injector) {
        if (!options.fullscreen) {
            page.backgroundSpanUnderStatusBar = true;
            page.className = 'vx-ns-dialog-page';
        }

        this._childInjector = Injector.create({
            providers: [
                {provide: VxNsDialogComponent, useValue: this}
            ],
            parent: injector
        })
    }

    _overlayTap(): void {
        if (this.options.disableClose)
            return;

        setTimeout(() => {
            if (this.dialogTapped) {
                this.dialogTapped = false;
            } else {
                this.close();
            }
        })
    }

    _dialogTap(): void {
        this.dialogTapped = true;
    }

    close(data?: any): void {
        this.onCloseSubject.next(data);
        this.onCloseSubject.complete();
    }

}