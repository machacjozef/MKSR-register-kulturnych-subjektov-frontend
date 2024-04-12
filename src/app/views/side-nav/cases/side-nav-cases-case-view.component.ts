import { Component, Inject, Optional, ViewChild} from '@angular/core';
import {
  DefaultTabbedCaseViewComponent,
  HeaderComponent,
  InjectedTabbedCaseViewDataWithNavigationItemTaskData
} from '@netgrif/components';
import {
  AbstractTabbedCaseViewComponent,
  AllowedNetsService,
  AllowedNetsServiceFactory,
  Case,
  CaseViewService,
  CategoryFactory,
  defaultCaseSearchCategoriesFactory, extractFieldValueFromData, extractIconAndTitle, Filter,
  FilterType, GroupNavigationConstants,
  HeaderMode,
  LoggerService, MergeOperator,
  NAE_BASE_FILTER,
  NAE_SEARCH_CATEGORIES,
  NAE_TAB_DATA,
  NAE_VIEW_ID_SEGMENT,
  OverflowService,
  SavedFilterMetadata, SearchMode,
  SearchService,
  SimpleFilter,
  ViewIdService,
} from '@netgrif/components-core';
import {ActivatedRoute} from "@angular/router";

const localAllowedNetsFactory = (factory: AllowedNetsServiceFactory) => {
  return factory.createWithAllNets();
};

const baseFilterFactory = () => {
  return {
    filter: SimpleFilter.emptyCaseFilter(),
  };
};

@Component({
  selector: 'app-side-nav-cases-case-view',
  templateUrl: './side-nav-cases-case-view.component.html',
  styleUrls: ['./side-nav-cases-case-view.component.scss'],
  providers: [
    CategoryFactory,
    CaseViewService,
    SearchService,
    OverflowService,
    {
      provide: NAE_BASE_FILTER,
      useFactory: baseFilterFactory,
    },
    {
      provide: AllowedNetsService,
      useFactory: localAllowedNetsFactory,
      deps: [AllowedNetsServiceFactory],
    },
    {
      provide: NAE_VIEW_ID_SEGMENT,
      useValue: 'cases',
    },
    ViewIdService,
    {provide: NAE_SEARCH_CATEGORIES, useFactory: defaultCaseSearchCategoriesFactory, deps: [CategoryFactory]},
  ],
})
export class SideNavCasesCaseViewComponent extends AbstractTabbedCaseViewComponent  {

  @ViewChild('header') public caseHeaderComponent: HeaderComponent;

  initialSearchMode: SearchMode;
  showToggleButton: boolean;
  enableSearch: boolean;
  showCreateCaseButton: boolean;
  showDeleteMenu: boolean;
  headersChangeable: boolean;
  headersMode: string[];
  allowTableMode: boolean;
  defaultHeadersMode: HeaderMode;

  constructor(caseViewService: CaseViewService,
              loggerService: LoggerService,
              viewIdService: ViewIdService,
              overflowService: OverflowService,
              @Inject(NAE_TAB_DATA) protected _injectedTabData: InjectedTabbedCaseViewDataWithNavigationItemTaskData) {
    super(caseViewService, loggerService, _injectedTabData, overflowService, undefined, undefined, _injectedTabData.newCaseButtonConfiguration);

    this.initialSearchMode = _injectedTabData.caseViewSearchTypeConfiguration.initialSearchMode;
    this.showToggleButton = _injectedTabData.caseViewSearchTypeConfiguration.showSearchToggleButton;
    this.enableSearch = _injectedTabData.caseViewSearchTypeConfiguration.initialSearchMode !== undefined;
    this.showCreateCaseButton = _injectedTabData.newCaseButtonConfiguration?.newCaseButtonConfig?.showCreateCaseButton;
    this.showDeleteMenu = _injectedTabData.caseViewShowMoreMenu;
    this.headersChangeable = _injectedTabData.caseViewHeadersChangeable;
    this.headersMode = _injectedTabData.caseViewHeadersMode ? _injectedTabData.caseViewHeadersMode : [];
    this.allowTableMode = this._injectedTabData.caseViewAllowTableMode;
    this.defaultHeadersMode = this.resolveHeaderMode(_injectedTabData.caseViewDefaultHeadersMode);

    if (!this.allowTableMode) {
      const viewId = viewIdService.viewId;
      localStorage.setItem(viewId + '-overflowMode', 'false');
    }
  }

  ngAfterViewInit(): void {
    super.initializeHeader(this.caseHeaderComponent);
    this.caseHeaderComponent.changeHeadersMode(this.defaultHeadersMode, false);
  }

  loadFilter(filterData: SavedFilterMetadata) {
    this._injectedTabData.tabViewRef.openTab({
      label: {
        text: filterData.filter.title
      },
      canBeClosed: true,
      tabContentComponent: DefaultTabbedCaseViewComponent,
      injectedObject: {...this._injectedTabData, filterCase: filterData.filterCase},
      order: this._injectedTabData.tabViewOrder,
      parentUniqueId: this._injectedTabData.tabUniqueId
    }, this._autoswitchToTaskTab, this._openExistingTab);
  }

  protected openTab(openCase: Case) {
    this._injectedTabData.tabViewRef.openTab({
      label: {
        text: openCase.title,
        icon: openCase.icon ? openCase.icon : 'check_box'
      },
      canBeClosed: true,
      tabContentComponent: this._injectedTabData.tabViewComponent,
      injectedObject: {
        baseFilter: this.resolveFilter(openCase),
        allowedNets: this.resolveAllowedNets(openCase),
        navigationItemTaskData: this._injectedTabData.navigationItemTaskData,
        searchTypeConfiguration: this._injectedTabData.taskViewSearchTypeConfiguration,
        showMoreMenu: this._injectedTabData.taskViewShowMoreMenu,
        headersChangeable: this._injectedTabData.taskViewHeadersChangeable,
        headersMode: this._injectedTabData.taskViewHeadersMode,
        allowTableMode: this._injectedTabData.taskViewAllowTableMode,
        defaultHeadersMode: this._injectedTabData.taskViewDefaultHeadersMode
      },
      order: this._injectedTabData.tabViewOrder,
      parentUniqueId: this._injectedTabData.tabUniqueId
    }, this._autoswitchToTaskTab, this._openExistingTab);
  }

  protected resolveFilter(openCase: Case): Filter {
    const additionalFilter = this._injectedTabData.taskViewAdditionalFilter;
    const mergeFilters = this._injectedTabData.taskViewMergeWithBaseFilter;
    // TODO maybe better implementation
    let baseFilter = new SimpleFilter('', FilterType.TASK, {case: {id: `${openCase.stringId}`}});
    const nodePath = extractFieldValueFromData<string>(this._injectedTabData.navigationItemTaskData, GroupNavigationConstants.ITEM_FIELD_ID_NODE_PATH)
    if(nodePath && nodePath.length > 0 && nodePath.endsWith("_dynamic")) {
      baseFilter =  new SimpleFilter('', FilterType.TASK, {case: {id: `${openCase.stringId}`}, transitionId: nodePath});
    }
    let filter;
    if (additionalFilter === undefined) {
      filter = baseFilter;
    } else if (mergeFilters) {
      filter = additionalFilter.merge(baseFilter, MergeOperator.AND);
    } else {
      filter = additionalFilter;
    }

    return filter;
  }

  protected resolveAllowedNets(openCase: Case): string[] {
    const additionalFilter = this._injectedTabData.taskViewAdditionalFilter;
    if (additionalFilter == undefined) {
      return [openCase.processIdentifier];
    }

    const mergeFilters = this._injectedTabData.taskViewMergeWithBaseFilter;
    const additionalAllowedNets = this._injectedTabData.taskViewAdditionalAllowedNets ? this._injectedTabData.taskViewAdditionalAllowedNets : [];

    return mergeFilters ? [openCase.processIdentifier, ...additionalAllowedNets] : additionalAllowedNets
  }

  isMenuOptionEnabled(option: string): boolean {
    return this.headersMode.some(e => e === option);
  }

  protected resolveHeaderMode(mode: string): HeaderMode {
    switch (mode) {
      case 'sort':
        return HeaderMode.SORT;
      case 'edit':
        return HeaderMode.EDIT;
      case 'search':
        return HeaderMode.SEARCH;
      default:
        return undefined;
    }
  }
}
