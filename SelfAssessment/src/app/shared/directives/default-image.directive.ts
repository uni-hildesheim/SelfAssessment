import { Directive, Input, HostBinding, HostListener, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[appImg]',
})

export class DefaultImgDirective implements OnInit {
  @Input() @HostBinding('src') src: string;

  ngOnInit() {
    this.src = `${environment.apiUrl}/${this.src}`;
  }

  @HostListener('error') updateUrl() {
    this.src = 'assets/images/platzhalter.png';
  }


}
