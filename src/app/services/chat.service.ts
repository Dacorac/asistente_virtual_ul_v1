import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

import { ApiAiClient, ApiAiConstants } from 'api-ai-javascript';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const lang = ApiAiConstants.AVAILABLE_LANGUAGES.ES;

export class Message {
  constructor(public content:string, public sentBy:string, public avatar?:string) { }
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.accessToken;
  readonly client = new ApiAiClient( { accessToken: this.token } );

  conversation = new BehaviorSubject<Message[]>([]);
  log:Message[] = [];

  constructor() { }

  converse( message:string ) {
    const userMessage = new Message(message, 'user', './assets/user.png');
    this.update(userMessage);
    this.updateLog(userMessage);

    return this.client.textRequest(message)
                      .then(this.extractData);
  }

  private extractData(res:any) {
    return res || {};
  }

  update( msg:Message) {
    this.conversation.next([msg]);
    // console.log(this.conversation);
  }

  updateLog( msg:Message ) {
    this.log.push( msg );
    // console.log(msg);
  }

  triggerIntent(eventName:string) {
    return this.client.eventRequest(eventName)
                      .then(this.extractData);
  }

}
