import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PopupService {

  private showPopupSource = new Subject();

  showPopup$ = this.showPopupSource.asObservable();

  showPopup() {
  	this.showPopupSource.next(true);
  }

  closePopup() {
  	this.showPopupSource.next(false);
  }

}
