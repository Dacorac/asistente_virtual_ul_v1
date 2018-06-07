import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, Directive } from '@angular/core';
import { ChatService, Message } from '../../services/chat.service';
import { PopupService } from '../../services/popup.service'; 
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})

@Directive({
  selector: 'textarea[autosize]'
})

export class ChatDialogComponent implements OnInit, AfterViewInit {


  messages: Observable<Message[]>;
  formValue: string;
  quickreplies:any[] = [];
  qrResponse:boolean = false;
  show:boolean;
  show$;

    constructor(private _popup:PopupService, private chat:ChatService, public element:ElementRef) { }

    ngOnInit() {
        // appends to array after each new message is added to feedSource
        this.messages = this.chat.conversation.asObservable()
        .scan((acc, val) => acc.concat(val) );

        this.chat.triggerIntent("Welcome")
                 .then(res => {
                    let response = res;
                    this.handleAction(response);
                    this.chooseResponseType(res);
                })
                .catch(error => console.log(error));  

        this.show$ = this._popup.showPopup$;
    }

    onHide() {
        this.show = false;
        console.log("onHide", this.show);
    }

    showPopup() {
        this._popup.showPopup();
    }

    closePopup() {
        this._popup.closePopup();
    }

    @ViewChild('toScroll') toScroll;
    
    ngAfterViewInit() {
        setTimeout(() => this.resize(), 0);
    }

    sendMessage() {
        this.chat.converse(this.formValue)
        .then(res => {

          let response = res;
          
          this.handleAction(response);
          this.chooseResponseType(response);
        })
        .catch(error => console.log(error));

        this.formValue = '';
        this.toScroll.nativeElement.scrollIntoView();
    }

    createQuickReplies( response:any ) {
        this.quickreplies = [];
        for(let i in response.payload.replies) {
            this.quickreplies.push(response.payload.replies[i]);
            // console.log(this.quickreplies[i]);
            const speech = response.payload.replies[i].title;
            const botMessage = new Message(speech, 'bot', './assets/bot.png');
            this.chat.updateLog(botMessage);   
        }

    }

    sendEvents(payload:any) {
        // console.log(payload.payload);
        for (let i in payload.payload.events) {
          // console.log(payload.payload.events[i].name);
          this.chat.triggerIntent(payload.payload.events[i].name)
            .then(res => {
                let response = res;
                this.handleAction(response);
                this.chooseResponseType(res);
            })
            .catch(error => console.log(error));
        }
    }

    sendQuickReply(payload:string) {
        let strPayload = payload.toString();
        this.chat.converse(strPayload)
        .then(res => {
            let response = res;
            this.handleAction(response);
            this.chooseResponseType(response);
        })
        .catch(error => console.log(error));
    }

    chooseResponseType(response:any) {

        for(let i in response.result.fulfillment.messages){
            let message = response.result.fulfillment.messages[i];

            if(message.type == 0){
                this.qrResponse = false;
                const speech = message.speech;
                const botMessage = new Message(speech, 'bot', './assets/bot.png');
                this.chat.update(botMessage);
                this.chat.updateLog(botMessage);    
            } else if(message.payload.objectType == "quick reply"){
                this.qrResponse = true;
                this.createQuickReplies(message);
            } else if(message.payload.objectType == "event") {
                this.qrResponse = false;
                this.sendEvents(message);
            }
        }

    }

    handleAction(response:any) {

        let action = response.result.action;
        // console.log(action);

        if(action == "input.welcome") {
            if(typeof response.result.parameters.user !== "undefined" && typeof response.result.parameters.email !== "undefined") {
                let user = response.result.parameters.user;
                let email = response.result.parameters.email;

                console.log ("user: ", user);
                console.log ("email: ", email);
            }
        } else if(action == "send.email") {
            console.log("Enviando email..");
        }


    }

    @HostListener('input', ['$event.target'])
    onInput(textArea:HTMLTextAreaElement):void {
        this.resize();
    }

    resize() {

        const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];  
        
        textArea.style.overflow = 'hidden';
        textArea.style.height  = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';

        // if (typeof textArea !== undefined) {
        //   console.log("defined");
        // } else {
        //   console.log("undefined");

        // }
        // if ((textArea.scrollHeight - 61) % 24 == 0) {
        //   this.numLines += 1;
        //   console.log("Lineas: ", this.numLines);
        // }
        // if(parseInt(textArea.style.height) < 110 ) {
        // }
        // else if (parseInt(textArea.style.height) >= 110 ) {
        //   textArea.style.height = 109 + 'px';
        //   textArea.style.overflow = 'scroll';
        // }

        // if( parseInt(textArea.style.height) < ((textArea.scrollHeight * 2 ) + 61) ) {
        //   console.log("menor a 90");
        //   textArea.style.overflow = 'hidden';
        //   textArea.style.height 	= 'auto';

        //   textArea.style.height = textArea.scrollHeight + 'px';
        // }
        // else if (parseInt(textArea.style.height) >= 90 ) {
        //   console.log("mayor o igual a 90");
        //   textArea.style.height = 90 + 'px';
        //   textArea.style.overflow = 'scroll';
        // }

    }
}
