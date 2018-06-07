import { Component, OnInit } from '@angular/core';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	show = false;

	onShow() {
		this.show = true;
	}

	constructor(private _popup:PopupService) { }

	show$;
	ngOnInit() {
		this.show$ = this._popup.showPopup$;
		console.log("show$", this.show$);
	}

	showPopup() {
		this._popup.showPopup();
		console.log("AppComponent showPopup");
	}

	closePopup() {
		this._popup.closePopup();
	}
}
