import { View } from "tns-core-modules/ui/core/view";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container";

export function coerceBooleanProperty(value: any): boolean {
    // tslint:disable-next-line
    return value != null && `${value}` !== 'false';
}


export function boundNumber(toBound: number, min: number, max: number): number {
    return Math.max(Math.min(toBound, max), min);
}

export function findVisibleView(view: View): View {
    while (view instanceof ProxyViewContainer) {
        view = view.getChildAt(0);
    }
    return view;
}