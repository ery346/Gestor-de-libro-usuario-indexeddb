import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[contCentrado]'
})
export class ContenidoCentradoDirective implements OnInit {
  html!: ElementRef<HTMLElement>;
  constructor(private elemento: ElementRef<HTMLElement>) {
    this.html = elemento;
   }

  ngOnInit(): void {
    this.setContenido();
  }
  setContenido(){
    this.html.nativeElement.style.display = 'flex';
    this.html.nativeElement.style.justifyContent = 'center';
  }

}
