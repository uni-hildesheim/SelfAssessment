import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TestpanelGuard implements CanActivate {

  constructor(private storageService: LocalStorageService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.storageService.getJournalStructure() == null ||
        this.storageService.getJournalLog() == null) {
        this.router.navigate(['dashboard']);
        return false;
      }
      return true;
  }
}
