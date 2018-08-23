import {Directive} from '@angular/core';

@Directive({
    selector: '[vx-ns-dialog-title]',
    host: {
        '[class.vx-ns-dialog-title]': 'true'
    }
})
export class VxNsDialogTitleDirective {
}

@Directive({
    selector: '[vx-ns-dialog-content]',
    host: {
        '[class.vx-ns-dialog-content]': 'true'
    }
})
export class VxNsDialogContentDirective {

}

@Directive({
    selector: 'FlexboxLayout[vx-ns-dialog-actions]',
    host: {
        '[class.vx-ns-dialog-actions]': 'true'
    }
})
export class VxNsDialogActionsDirective {

}