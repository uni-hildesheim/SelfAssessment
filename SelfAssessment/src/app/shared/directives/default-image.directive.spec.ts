import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DefaultImgDirective } from './default-image.directive';
import { By } from '@angular/platform-browser';


@Component({
    selector: 'app-fake',
    template: '<img appImg src="fake-img.jpg"/>'
})
class TestComponent {}


describe('DefaultImageDirective', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          DefaultImgDirective
        ]
      });
      TestBed.compileComponents();
    }));

    it('should load default img on error', () => {
        const fixture = TestBed.createComponent(TestComponent);
        const directiveEl = fixture.debugElement.query(By.directive(DefaultImgDirective));
        expect(directiveEl).not.toBeNull();
        const imgSrc = fixture.debugElement.nativeElement.querySelector('img').src;
        expect(imgSrc).toContain('fake-img.jpg');
    });

});

