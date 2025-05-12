import { AfterViewChecked, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[juegosScrollBottom]',
})
export class ScrollBottomDirective implements AfterViewChecked {
  private elementRef: ElementRef<HTMLDivElement> = inject(ElementRef<HTMLDivElement>);

  ngAfterViewChecked(): void {
    this._scrollToBottom();
  }

  private _scrollToBottom(): void {
    const element: HTMLDivElement = this.elementRef.nativeElement;

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
