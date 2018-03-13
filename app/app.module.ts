import { RegistrationComponent } from './registration/registration.component';
import { BehaviorService } from './bank-forder/service-all/services/behavior.service';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { LayoutComponent } from './mobile/layout/layout.component';
import { MenuComponent } from './mobile/layout/menu/menu.component';
import { MessageComponent } from './mobile/layout/message/message.component';
import { ActivityComponent } from './mobile/layout/activity/activity.component';
import { GroupComponent } from './mobile/layout/group/group.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatComponent } from './mobile/chat/chat.component';
import { LoginService } from './bank-forder/service-all/services/login.service';
import { UserService } from './bank-forder/service-all/services/user.service';
import { SocketService } from './bank-forder/service-all/services/socket.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    MessageComponent,
    ActivityComponent,
    GroupComponent,
    ChatComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    HttpModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    PerfectScrollbarModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full'
        },
        {
          path: 'login', component: LoginComponent
        },
        {
          canActivate: [LoginService],
          path: 'layout', component: LayoutComponent, children: [
            { path: 'message', component: MessageComponent },
            { path: 'activity', component: ActivityComponent },
            { path: 'group', component: GroupComponent }
          ]
        },
        {
          canActivate: [LoginService],
          path: 'chat/:name/:id', component: ChatComponent
        },
        {
          path: 'register', component: RegistrationComponent
        }
      ]
    ),
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
    LoginService, UserService, BehaviorService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
