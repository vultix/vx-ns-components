import {Directive, Inject} from '@angular/core';
import {VX_NS_PAGER_TOKEN} from './vx-ns-pager.token';
import {VxNsPagerComponent} from './vx-ns-pager.component';

@Directive({
  selector: '[vxNsPagerPrevious], [vxNsPagerBack]',
  host: {
    '(tap)': '_pager.previous()'
  }
})
export class VxPagerPreviousDirective {
  constructor(@Inject(VX_NS_PAGER_TOKEN) public _pager: VxNsPagerComponent) {
  }
}

@Directive({
  selector: '[vxNsPagerNext]',
  host: {
    '(tap)': '_pager.next()'
  }
})
export class VxPagerNextDirective {
  constructor(@Inject(VX_NS_PAGER_TOKEN) public _pager: VxNsPagerComponent) {
  }
}
