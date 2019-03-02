import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinDialogComponent } from './pin-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Observable, of, throwError } from 'rxjs';
import { Journal } from 'src/app/shared/models/state/journal.model';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { JournalService } from 'src/app/shared/services/journal/journal.service';

const strings = {
  'btn-pin-input': 'PIN Input',
  'lbl-pin-request': 'Please provide PIN'
};

@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}


describe('PinDialogComponent', () => {
  let component: PinDialogComponent;
  let fixture: ComponentFixture<PinDialogComponent>;
  let storageService: LocalStorageService;
  let journalService: JournalService;

  const storageStub = {
    persistInStorage(item: StorageItem, value: any) {}
  };

  const journalStub = {
    loadJournal(pin: number): Observable<Journal> {
      return of(new Journal());
    }
  };

  const dialogRefStub = {
    close(dialogResult?: any): void { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinDialogComponent, MockPipe ],
      imports: [MaterialModule, ReactiveFormsModule, FormsModule,
        ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: LocalStorageService, useValue: storageStub},
        { provide: JournalService, useValue: journalStub},
         GlobalIndicator]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinDialogComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(LocalStorageService);
    journalService = TestBed.get(JournalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the journal', () => {
    spyOn(storageService, 'persistInStorage');
    spyOn(journalService, 'loadJournal').and.callThrough();
    component.getJournal();
    expect(storageService.persistInStorage).toHaveBeenCalled();
    expect(journalService.loadJournal).toHaveBeenCalled();
  });

  it('should handle 404 error for false pin', () => {
    spyOn(journalService, 'loadJournal').and.returnValue(throwError({status: 404}));
    component.getJournal();
    expect(journalService.loadJournal).toHaveBeenCalled();
  });

  it('should translate the text', () => {
    expect(fixture.nativeElement.querySelector('h1').innerHTML).toEqual('PIN Input');
    expect(fixture.nativeElement.querySelectorAll('p')[0].innerHTML).toEqual('Please provide PIN');
  });

});
