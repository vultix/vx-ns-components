import {
    ApplicationRef,
    ComponentFactoryResolver,
    Inject,
    Injectable,
    Injector,
    StaticProvider,
    Type
} from '@angular/core';
import {ios, View} from 'tns-core-modules/ui/core/view';
import {Page} from 'tns-core-modules/ui/page';
import {Frame, topmost} from 'tns-core-modules/ui/frame';
// import {PAGE_FACTORY, PageFactory} from 'nativescript-angular';
import {_VX_NS_DIALOG_OPTIONS, VX_NS_DIALOG_DATA} from './dialog.tokens';
import {VxNsDialogComponent} from './vx-ns-dialog.component';
import {isIOS} from 'tns-core-modules/platform';
import {VxNsLoadingIndicatorComponent} from './loading-indicator/vx-ns-loading-indicator.component';

const utils = require('tns-core-modules/utils/utils');

const viewCommon = require('tns-core-modules/ui/core/view/view-common').ViewCommon;

interface BaseVxDialogOptions {
    disableClose?: boolean;
    fullscreen?: boolean;
    width?: number;
    height?: number;
}

export interface VxNsDialogComponentOptions extends BaseVxDialogOptions {
    component: Type<any>;
    data: any;
}

export interface VxNsDialogOptions extends BaseVxDialogOptions {
    title: string;
    message: string;
    buttons: string[];
    /**
     * Defaults to true
     */
    disableClose?: boolean;
}

type VxNsModal<T> = T & { _vxNsModal?: VxNsModal<View>, parent?: VxNsModal<View> };
let fixedModals = false;
@Injectable()
export class VxNsDialog {
    private indicator?: VxNsDialogComponent;

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector, private appRef: ApplicationRef) {
        if (!fixedModals) {
            this.fixModals();
            fixedModals = true;
        }
    }

    open(options: VxNsDialogComponentOptions | VxNsDialogOptions): VxNsDialogComponent {
        let parentView = this.findViewWithoutModal(topmost()) as VxNsModal<View>;
        const page = new Page() as VxNsModal<Page>;

        if ('title' in options && options.disableClose === undefined) {
            options.disableClose = true;
        }

        const providers: StaticProvider[] = [
            {provide: VX_NS_DIALOG_DATA, useValue: 'data' in options ? options.data : null},
            {provide: _VX_NS_DIALOG_OPTIONS, useValue: options},
            {provide: Page, useValue: page}
        ];

        const injector = Injector.create({
            providers,
            parent: this.injector
        });

        const factory = this.resolver.resolveComponentFactory(VxNsDialogComponent);
        const ref = factory.create(injector);
        this.appRef.attachView(ref.hostView);
        ref.changeDetectorRef.detectChanges();

        const componentView = ref.location.nativeElement as View;
        if (componentView.parent) {
            componentView.parent._removeView(componentView);
        }
        page.content = ref.location.nativeElement;

        let closed = false;
        let closedFromInstance = false;
        const closeCallback = () => {
            if (!closedFromInstance) {
                ref.instance.close();
                return;
            } else if (closed) {
                return;
            } else if (shouldPostponeClose(page, parentView)) {
                setTimeout(() => {
                    closeCallback();
                }, 50);
                return;
            }

            closed = true;
            page.closeModal();
            ref.destroy();
        };

        if (shouldPostponeOpen(parentView)) {
            const i = setInterval(() => {
                parentView = this.findViewWithoutModal(topmost()) as VxNsModal<View>;
                if (!shouldPostponeOpen(parentView)) {
                    clearInterval(i);
                    parentView.showModal(page, null, closeCallback, options.fullscreen);
                    parentView._vxNsModal = page;
                }
            }, 100);
        } else {
            parentView.showModal(page, null, closeCallback, options.fullscreen);
            parentView._vxNsModal = page;
        }


        ref.instance.onClose.subscribe(() => {
            closedFromInstance = true;
            closeCallback();
        });

        return ref.instance;
    }

    showLoadingIndicator(message = 'Loading...'): void {
        if (this.indicator) {
            this.indicator.close();
        }
        this.indicator = this.open({component: VxNsLoadingIndicatorComponent, data: {message}, disableClose: true});
    }

    closeLoadingIndicator(): void {
        if (this.indicator) {
            this.indicator.close();
            this.indicator = undefined;
        }
    }

    private findViewWithoutModal(view: Frame): View {
        if (!view.modal)
            return view;

        let current = view.modal;
        while (current.modal) {
            current = current.modal;
        }
        return current;
    }

    private fixModals(): void {
        if (isIOS) {
            // iOS by default won't let us have a transparent background on a modal
            // Ugly workaround from: https://github.com/NativeScript/nativescript/issues/2086#issuecomment-221956483

            const getParentWithViewController = (parent: View): View => {
                let view = parent;
                let controller = view.viewController;
                while (!controller) {
                    view = view.parent as View;
                    controller = view.viewController;
                }

                return view;
            };

            (View as any).prototype._showNativeModalView = function (
                parent: View,
                context: any,
                closeCallback: Function,
                fullscreen?: boolean,
                animated?: boolean,
                stretched?: boolean
            ) {
                // TODO: why is the getParentWithViewController undefined?

                const parentWithController = getParentWithViewController(parent);
                const parentController = parentWithController.viewController;
                if (!parentController.view || !parentController.view.window) {
                    setTimeout(() => {
                        this._showNativeModalView(parent, context, closeCallback, fullscreen, animated, stretched);
                    }, 50);
                    return;
                }

                viewCommon.prototype._showNativeModalView.call(
                    this,
                    parentWithController,
                    context,
                    closeCallback,
                    fullscreen,
                    stretched
                );

                let controller = this.viewController;
                if (!controller) {
                    controller = ios.UILayoutViewController.initWithOwner(new WeakRef(this));
                    this.viewController = controller;
                }

                this._setupAsRootView({});


                if (!parentController.view.window) {
                    throw new Error(
                        'Parent page is not part of the window hierarchy. Close the current modal page before showing another one!'
                    );
                }

                if (fullscreen) {
                    controller.modalPresentationStyle = UIModalPresentationStyle.FullScreen;
                } else {
                    controller.modalPresentationStyle = UIModalPresentationStyle.OverFullScreen;
                    controller.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
                }

                this.horizontalAlignment = 'stretch';
                this.verticalAlignment = 'stretch';

                this._raiseShowingModallyEvent();
                animated = animated === undefined ? true : !!animated;

                (<any>controller).animated = animated;

                parentController.presentViewControllerAnimatedCompletion(controller, animated, null);
                const transitionCoordinator = utils.ios.getter(parentController, parentController.transitionCoordinator);

                const that = this;

                if (transitionCoordinator) {
                    UIViewControllerTransitionCoordinator.prototype.animateAlongsideTransitionCompletion.call(
                        transitionCoordinator,
                        null,
                        () => that._raiseShownModallyEvent()
                    );
                } else {
                    // Apparently iOS 9+ stops all transitions and animations upon application suspend and transitionCoordinator becomes null here in this case.
                    // Since we are not waiting for any transition to complete, i.e. transitionCoordinator is null, we can directly raise our shownModally event.
                    // Take a look at https://github.com/NativeScript/NativeScript/issues/2173 for more info and a sample project.
                    this._raiseShownModallyEvent();
                }
            };
        }
    };
}

function shouldPostponeClose(view: VxNsModal<View>, parentView: View): boolean {
    const child = view._vxNsModal;
    if (isIOS) {
        if (view.ios.beingPresented || parentView.ios.beingPresented) {
            return true;
        } else if (child) {
            if (child.ios.beingPresented || child.ios.beingDismissed) {
                child.closeModal();
                return true;
            } else if (child._vxNsModal) {
                return shouldPostponeClose(child._vxNsModal, child);
            } else {
                view._vxNsModal = undefined;
            }
        }
    }
    return false;
}

function shouldPostponeOpen(parentView: VxNsModal<View>): boolean {
    if (isIOS) {
        if (parentView.ios.beingDismissed || parentView.ios.beingPresented) {
            return true;
        } else if (parentView.parent) {
            return shouldPostponeOpen(parentView.parent);
        }
    }
    return false;
}

declare let UIModalTransitionStyleCrossDissolve: any;
declare let UIModalPresentationStyle: any;
declare let UIViewControllerTransitionCoordinator: any;

