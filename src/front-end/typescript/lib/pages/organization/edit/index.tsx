import { getAlertsValid, getContextualActionsValid, getMetadataValid, getModalValid, makePageMetadata, sidebarValid, updateValid, viewValid } from 'front-end/lib';
import { isUserType } from 'front-end/lib/access-control';
import router from 'front-end/lib/app/router';
import { SharedState } from 'front-end/lib/app/types';
import * as TabbedPage from 'front-end/lib/components/sidebar/menu/tabbed-page';
import { Immutable, immutable, PageComponent, PageInit, replaceRoute } from 'front-end/lib/framework';
import * as api from 'front-end/lib/http/api';
import * as Tab from 'front-end/lib/pages/organization/edit/tab';
import { Organization } from 'shared/lib/resources/organization';
import { UserType } from 'shared/lib/resources/user';
import { adt, ADT, Id } from 'shared/lib/types';
import { invalid, valid, Validation } from 'shared/lib/validation';

interface ValidState<K extends Tab.TabId> extends Tab.ParentState<K> {
  organization: Organization;
}

export type State_<K extends Tab.TabId> = Validation<Immutable<ValidState<K>>, null>;

export type State = State_<Tab.TabId>;

export type Msg_<K extends Tab.TabId> = Tab.ParentMsg<K, ADT<'noop'>>;

export type Msg = Msg_<Tab.TabId>;

export interface RouteParams {
  orgId: Id;
  tab?: Tab.TabId;
}

function makeInit<K extends Tab.TabId>(): PageInit<RouteParams, SharedState, State_<K>, Msg_<K>> {
  return isUserType({
    userType: [UserType.Vendor, UserType.Admin],

    async success({ routePath, dispatch, routeParams, shared }) {
      const organizationResult = await api.organizations.readOne(routeParams.orgId);
      if (!api.isValid(organizationResult)) {
        dispatch(replaceRoute(adt('notFound' as const, { path: routePath })));
        return invalid(null);
      }
      const organization = organizationResult.value;
      const affiliationsResult = await api.affiliations.readManyForOrganization(organization.id);
      if (!api.isValid(affiliationsResult)) {
        dispatch(replaceRoute(adt('notFound' as const, { path: routePath })));
        return invalid(null);
      }
      const viewerUser = shared.sessionUser;
      // Set up the visible tab state.
      const tabId = routeParams.tab || 'organization';
      const tabState = immutable(await Tab.idToDefinition(tabId, organization).component.init({
        organization,
        affiliations: affiliationsResult.value,
        viewerUser
      }));
      // Everything checks out, return valid state.
      return valid(immutable({
        organization,
        tab: [tabId, tabState],
        sidebar: await Tab.makeSidebarState(organization, tabId)
      })) as State_<K>;
    },
    async fail({ routePath, dispatch, shared, routeParams }) {
      if (!shared.session || !shared.session.user) {
        dispatch(replaceRoute(adt('signIn' as const, {
          redirectOnSuccess: router.routeToUrl(adt('orgEdit', {orgId: routeParams.orgId}))
        })));
      } else {
        dispatch(replaceRoute(adt('notFound' as const, { path: routePath })));
      }
      return invalid(null);
    }
  });
}

function makeComponent<K extends Tab.TabId>(): PageComponent<RouteParams, SharedState, State_<K>, Msg_<K>> {
  const idToDefinition: TabbedPage.IdToDefinitionWithState<Tab.Tabs, K, ValidState<K>> = state => id => Tab.idToDefinition(id, state.organization);
  return {
    init: makeInit(),
    update: updateValid(TabbedPage.makeParentUpdate({
      extraUpdate: ({ state }) => [state],
      idToDefinition
    })),
    view: viewValid(TabbedPage.makeParentView(idToDefinition)),
    sidebar: sidebarValid(TabbedPage.makeParentSidebar()),
    getAlerts: getAlertsValid(TabbedPage.makeGetParentAlerts(idToDefinition)),
    getModal: getModalValid(TabbedPage.makeGetParentModal(idToDefinition)),
    getContextualActions: getContextualActionsValid(TabbedPage.makeGetParentContextualActions(idToDefinition)),
    getMetadata: getMetadataValid(TabbedPage.makeGetParentMetadata({
      idToDefinition,
      getTitleSuffix: state => `— ${state.organization.legalName} — Edit Organization`
    }), makePageMetadata('Edit Organization'))
  };
}

export const component: PageComponent<RouteParams, SharedState, State, Msg> = makeComponent();