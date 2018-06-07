import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatDialogComponent } from './../../components/chat-dialog/chat-dialog.component';

import { ChatService } from './../../services/chat.service';
import { PopupService } from './../../services/popup.service';

import { CapitalizePipe } from './../../pipes/capitalize.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ChatDialogComponent,
    CapitalizePipe
  ],
  exports: [ChatDialogComponent],
  providers: [
    ChatService,
    PopupService
  ]
})
export class ChatModule { }
