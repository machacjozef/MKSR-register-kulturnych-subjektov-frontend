import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AuthenticationComponentModule,
  CaseViewComponentModule,
  DashboardComponentModule,
  DataFieldsComponentModule,
  DialogComponentsModule,
  HeaderComponentModule,
  LoginFormComponentModule,
  NavigationComponentModule,
  PanelComponentModule,
  QuickPanelComponentModule,
  SearchComponentModule,
  SideMenuComponentModule,
  SideMenuContentComponentModule,
  SideMenuNewCaseComponentModule,
  TabsComponentModule,
  ToolbarComponentModule,
  UserComponentModule,
} from '@netgrif/components';
import {
  AuthenticationModule,
  ConfigurationService,
  MaterialModule,
  TaskResourceService,
  TranslateLibModule,
  UriResourceService,
  ViewService,
} from '@netgrif/components-core';
import { PieChartModule } from '@swimlane/ngx-charts';
import { ResizableModule } from 'angular-resizable-element';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EtaskFrontendConfigurationService } from './etask-frontend-configuration.service';
import { EtaskFrontendViewService } from './etask-frontend-view.service';
import { DashboardComponent } from './views/dashboard/dashboard/dashboard.component';
import { EtaskUriResourceService } from './views/dashboard/service/etask-uri-resource.service';
import { LoginComponent } from './views/login/login.component';
import {
  EtaskTaskListPaginationComponent,
} from './views/panel/task-panel-list-pagination/etask-task-list-pagination.component';
import { EtaskTaskListComponent } from './views/panel/task-panel-list/etask-task-list.component';
import { EtaskTaskPanelComponent } from './views/panel/task-panel/etask-task-panel.component';
import { PublicResolverComponent } from './views/public/public-resolver/public-resolver.component';
import { PublicSingleTaskViewComponent } from './views/public/public-single-task-view/public-single-task-view.component';
import { PublicTaskViewComponent } from './views/public/public-task-view/public-task-view.component';
import { PublicWorkflowViewComponent } from './views/public/public-workflow-view/public-workflow-view.component';
import { ETaskTaskResourceService } from './views/public/service/e-task-task-resource.service';
import { SideNavCasesCaseViewComponent } from './views/side-nav/cases/side-nav-cases-case-view.component';
import { EmptyViewComponent } from './views/side-nav/emptyView/empty-view.component';
import { ETaskDoubleDrawerComponent } from './views/side-nav/etask-double-drawer/e-task-double-drawer.component';
import { SidenavComponent } from './views/side-nav/sidenav.component';
import { SideNavTasksTaskViewComponent } from './views/side-nav/tasks/side-nav-tasks-task-view.component';
import { WorkflowPanelComponent } from './views/workflow/workflow-panel/workflow-panel.component';
import { WorkflowViewComponent } from './views/workflow/workflow-view/workflow-view.component';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavComponent,
    SideNavCasesCaseViewComponent,
    SideNavTasksTaskViewComponent,
    EmptyViewComponent,
    DashboardComponent,
    PublicResolverComponent,
    PublicTaskViewComponent,
    PublicWorkflowViewComponent,
    EtaskTaskListComponent,
    EtaskTaskPanelComponent,
    EtaskTaskListPaginationComponent,
    PublicSingleTaskViewComponent,
    ETaskDoubleDrawerComponent,
    WorkflowPanelComponent,
    WorkflowViewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexModule,
    MaterialModule,
    FlexLayoutModule,
    AuthenticationModule,
    SideMenuComponentModule,
    AuthenticationComponentModule,
    TranslateLibModule,
    LoginFormComponentModule,
    ToolbarComponentModule,
    NavigationComponentModule,
    HeaderComponentModule,
    PanelComponentModule,
    CaseViewComponentModule,
    SearchComponentModule,
    QuickPanelComponentModule,
    TabsComponentModule,
    SideMenuNewCaseComponentModule,
    DashboardComponentModule,
    ResizableModule,
    UserComponentModule,
    PieChartModule,
    CommonModule,
    MaterialModule,
    SideMenuContentComponentModule,
    HeaderComponentModule,
    PanelComponentModule,
    DataFieldsComponentModule,
    DialogComponentsModule
  ],
  providers: [
    { provide: ConfigurationService, useClass: EtaskFrontendConfigurationService },
    { provide: ViewService, useClass: EtaskFrontendViewService },
    { provide: TaskResourceService, useClass: ETaskTaskResourceService },
    { provide: UriResourceService, useClass: EtaskUriResourceService },
  ],
})
export class AppModule {
}
