import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import { VxNsMenuComponent } from "./vx-ns-menu.component";

@Directive({
  selector: '[vxNsAttachMenu]'
})
export class VxNsAttachMenuDirective implements OnInit {
  @Input() vxNsAttachMenu: VxNsMenuComponent;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (!this.vxNsAttachMenu) {
      throw new Error('vxNsAttachMenu without an attached menu');
    }
    this.vxNsAttachMenu.view = this.el.nativeElement;
  }
}
