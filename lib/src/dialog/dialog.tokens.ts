import {InjectionToken} from '@angular/core';
import {VxNsDialogOptions, VxNsDialogComponentOptions} from './vx-ns-dialog.service';

export const VX_NS_DIALOG_DATA = new InjectionToken<any>("VX_NS_DIALOG_DATA");
export const _VX_NS_DIALOG_OPTIONS = new InjectionToken<VxNsDialogOptions | VxNsDialogComponentOptions>("VX_NS_DIALOG_OPTIONS");