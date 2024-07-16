import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongClick]'
})
export class LongClickDirective {

  @Output() longClick = new EventEmitter<void>();

  private timeClick: any;

  constructor() {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.timeClick = setTimeout(() => {
      this.longClick.emit();
    }, 1000); // Thời gian giữ chuột để kích hoạt sự kiện (1000ms)
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    clearTimeout(this.timeClick);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    clearTimeout(this.timeClick);
  }
}
