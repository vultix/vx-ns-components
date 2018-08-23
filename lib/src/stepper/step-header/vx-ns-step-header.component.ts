import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { VxNsStepComponent } from '../step/vx-ns-step.component';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures';

@Component({
    selector: 'vx-ns-step-header',
  templateUrl: './vx-ns-step-header.component.html',
  styleUrls: ['./vx-ns-step-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxNsStepHeaderComponent {
  @Input() step: VxNsStepComponent;
  @Input() active = false;
  @Input() number: number;
  @Input() disabled = false;
  @Output() tap = new EventEmitter();

  fingerDown = false;

  handleTouch(event: TouchGestureEventData): void {
    if (this.disabled) {
      this.fingerDown = false;
      return;
    }

    this.fingerDown = event.action === 'down' || event.action === 'move';
  }
}
