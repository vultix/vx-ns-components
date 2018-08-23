import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {Color, isIOS, Page} from 'tns-core-modules/ui/page';
import {VX_NS_DIALOG_DATA} from '../dialog.tokens';
import {VxNsDialogComponent} from '../vx-ns-dialog.component';
import {ActivityIndicator} from 'tns-core-modules/ui/activity-indicator';

declare let UIActivityIndicatorViewStyle: any;

@Component({
    templateUrl: './vx-ns-loading-indicator.component.html',
    styleUrls: ['./vx-ns-loading-indicator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsLoadingIndicatorComponent {
    constructor(@Inject(VX_NS_DIALOG_DATA) public data: any) {
    }

    _indicatorLoaded(indicator: ActivityIndicator): void {
        if (isIOS) {
            indicator.ios.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.WhiteLarge;
            indicator.ios.color = indicator.style.color.ios;
        }
    }

}