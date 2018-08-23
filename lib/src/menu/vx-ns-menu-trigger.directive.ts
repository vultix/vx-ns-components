import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import { VxNsMenuComponent } from "./vx-ns-menu.component";

@Directive({
  selector: '[vxNsMenuTrigger]',
  host: {
    '(tap)': 'onTap()'
  }
})
export class VxNsMenuTriggerDirective implements OnInit {
  @Input() vxNsMenuTrigger: VxNsMenuComponent;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (!this.vxNsMenuTrigger) {
      throw new Error('vxNsMenuTrigger without a dropdown');
    }
  }

  onTap(): void {
    this.vxNsMenuTrigger.view = this.el.nativeElement;
    this.vxNsMenuTrigger.toggle();
  }
}
