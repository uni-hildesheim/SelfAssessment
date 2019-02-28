import { Directive, Input, HostBinding, HostListener, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Directive to handle the image src of every image.
 */
@Directive({
  selector: '[appImg]',
})
export class DefaultImgDirective implements OnInit {

  /**
   * The two way binded image src.
   */
  @Input() @HostBinding('src') src: string;

  /**
   * Complete the image path on init.
   */
  ngOnInit() {
    this.src = `${environment.apiUrl}/${this.src}`;
  }

  /**
   * Replace the image src with a default image if the path is not valid.
   */
  @HostListener('error') updateUrl() {
    console.log('I GOT CALLED');
    this.src = 'assets/images/platzhalter.png';
  }


}
