import {
    AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnDestroy,
    Output,
    QueryList,
    ViewChild
} from "@angular/core";
import { isIOS, View } from "tns-core-modules/ui/core/view";
import * as application from 'tns-core-modules/application';
import { coerceBooleanProperty, findVisibleView } from "../shared/util";
import { VxNsItemComponent } from "./item/vx-ns-item.component";
import { VX_NS_MENU_TOKEN } from "./vx-ns-menu.token";
import { createAnimation } from "../shared";
import { ScrollView } from "tns-core-modules/ui/scroll-view";
import { screen } from "tns-core-modules/platform";
import { topmost } from "tns-core-modules/ui/frame";
import { AbsoluteLayout } from "tns-core-modules/ui/layouts/absolute-layout";
import { Subscription } from "rxjs";

const MAX_HEIGHT = 150;

declare const android: any;

@Component({
    selector: 'vx-ns-menu',
    templateUrl: './vx-ns-menu.component.html',
    styleUrls: ['./vx-ns-menu.component.scss'],
    providers: [
        {provide: VX_NS_MENU_TOKEN, useExisting: forwardRef(() => VxNsMenuComponent)}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsMenuComponent<T = string> implements OnDestroy, AfterContentInit {
    /** The dropdown's items */
    @ContentChildren(VxNsItemComponent, {descendants: true}) items: QueryList<VxNsItemComponent<T>>;

    @Input() view?: View;

    @Input() offsetLeft = 0;
    @Input() offsetTop = 10;

    @Input() matchWidth = false;

    /** If true the dropdown will automatically close when an item is chosen, or when clicked off of the dropdown  */
    @Input() autoClose = true;

    /** The default text to display if there are no items */
    @Input() defaultText: string;

    _screenWidth = screen.mainScreen.widthDIPs;
    _screenHeight = screen.mainScreen.heightDIPs;

    _ios = isIOS;

    /** Event thrown when the dropdown's visibility changes. The value is the visibility (true or false) */
    @Output() visibleChange = new EventEmitter<boolean>();
    /** Event thrown when an item is chosen.  Will emit the selected vx-item's value */
    @Output() itemSelect = new EventEmitter<T>();
    @ViewChild('menu') menu: ElementRef<ScrollView>;
    @ViewChild('container') container: ElementRef<AbsoluteLayout>;
    private popupWindow: any;

    constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {

    }

    private _visible = false;

    /** Whether the dropdown is visible */
    @Input()
    get visible(): boolean {
        return this._visible;
    };

    set visible(visible: boolean) {
        visible = coerceBooleanProperty(visible);
        if (visible !== this._visible) {
            this._visible = visible;
            this.visibleChange.emit(visible);

            if (visible) {
                this.show();
            } else {
                this.hide();
            }
            this.cdr.markForCheck();
        }

    };

    toggle(): void {
        this.visible = !this.visible;
    }

    ngOnDestroy(): void {
        // this.gestureObserver.disconnect();
    }

    ngAfterContentInit(): void {
        this.items.changes.subscribe(() => {
            setTimeout(() => {
                if (this.visible) {
                    this.position();
                }
            }, 10)
            this.cdr.markForCheck();
        })
    }

    _overlayTap(): void {
        if (this.autoClose) {
            this.visible = false;
        }
    }

    private show(): void {
        if (!this.view) {
            throw new Error('Tried showing a vx-ns-menu component without an attached view');
        }

        this.position();
        this.menu.nativeElement.style.scaleY = 0;

        const container = this.container.nativeElement;

        if (isIOS) {
            const window = application.ios.window;

            window.addSubview(container.ios);
        } else {
            const popupWindow = new android.widget.PopupWindow(application.android.currentContext);
            popupWindow.setInputMethodMode(android.widget.PopupWindow.INPUT_METHOD_NEEDED);
            popupWindow.setFocusable(false);
            popupWindow.setOutsideTouchable(false);

            const drawable = new android.graphics.drawable.ColorDrawable(0);
            // drawable.setAlpha(0);
            popupWindow.setBackgroundDrawable(drawable);
            popupWindow.setWidth(screen.mainScreen.widthPixels);
            popupWindow.setHeight(screen.mainScreen.heightPixels);

            const parent = container.android.getParent();
            if (parent) {
                parent.removeView(container.android);
            }

            popupWindow.setContentView(container.android);

            popupWindow.showAtLocation(topmost().nativeView, 0, 0, 0);
            this.popupWindow = popupWindow;
        }

        this.zone.runOutsideAngular(() => {
            createAnimation(200).subscribe(num => {
                this.menu.nativeElement.style.scaleY = num;
            })
        });

        // Kludge to allow the android textfield to be repositioned
        setTimeout(() => {
            this.position()
        }, 300);
    }

    private position(): void {
        if (!this.view)
            return;

        const view = findVisibleView(this.view);

        const viewLocation = view.getLocationInWindow();
        if (!viewLocation) {
            setTimeout(() => {
                this.position();
            }, 50);

            return;
        }

        const viewSize = view.getActualSize();

        const menu = this.menu.nativeElement;
        let height = menu.content.getMeasuredHeight() / screen.mainScreen.scale;

        if (height >= MAX_HEIGHT) {
            height = MAX_HEIGHT;
            menu.height = MAX_HEIGHT;
        } else {
            menu.height = 'auto';
        }

        menu.left = viewLocation.x + this.offsetLeft;
        menu.top = viewLocation.y + viewSize.height + this.offsetTop - (isIOS ? 0 : 20);

        if (menu.top > (screen.mainScreen.heightDIPs / 2.5)) { // TODO: better way to see if should be on bottom
            menu.top = viewLocation.y - this.offsetTop - height - (isIOS ? 0 : 20);
            menu.originY = 1;
        } else {
            menu.originY = 0;
        }
        menu.originX = 0.5;
        menu.style.scaleX = 1;

        if (this.matchWidth) {
            menu.width = viewSize.width;
        }
    }

    private hide(): void {
        const menu = this.menu.nativeElement;

        this.close();

        // TODO: get closing animation working;
        // this.zone.runOutsideAngular(() => {
        //     this.animation = createAnimation(200).subscribe(num => {
        //         menu.style.scaleY = 1 - num;
        //
        //         if (num === 1) {
        //             this.close();
        //             this.animation = undefined;
        //         }
        //     })
        // });
    }

    private close(): void {
        if (isIOS) {
            this.container.nativeElement.ios.removeFromSuperview();
        } else {
            this.popupWindow.dismiss();
        }
    }
}