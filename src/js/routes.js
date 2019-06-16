import HomePage from '../pages/home.vue'
import AboutPage from '../pages/about.vue'
import FormPage from '../pages/form.vue'
import DynamicRoutePage from '../pages/dynamic-route.vue'
import NotFoundPage from '../pages/not-found.vue'

// import OverviewTab from '../pages/home/overview-tab.vue'
// import LocationsTab from '../pages/home/locations-tab.vue'
// import EquipmentsTab from '../pages/home/equipments-tab.vue'
// import PropertiesTab from '../pages/home/properties-tab.vue'

import SitemapPage from '../pages/sitemap.vue'

import SetupWizard from '../pages/wizards/setup-wizard.vue'
import SetupWizardPage from '../pages/wizards/setup-wizard-page.vue'
import SettingsMenuPage from '../pages/settings/settings-menu.vue'
import ServiceSettingsPage from '../pages/settings/services/service-settings.vue'
import AddonsListPage from '../pages/settings/addons/addons-list.vue'
import AddonsAddPage from '../pages/settings/addons/addons-add.vue'

// import ItemsListPage from '../pages/settings/items/items-list.vue'
import ItemsListPage from '../pages/settings/items/items-list-vlist.vue'
// import ItemsVirtualListPage from '../pages/settings/items/items-list-vlist.vue'
import ItemDetailsPage from '../pages/settings/items/item-details.vue'
import ItemEditPage from '../pages/settings/items/item-edit.vue'

import ThingsListPage from '../pages/settings/things/things-list.vue'
import ThingDetailsPage from '../pages/settings/things/thing-details.vue'
import AddThingChooseBindingPage from '../pages/settings/things/add/choose-binding.vue'
import AddThingChooseThingTypePage from '../pages/settings/things/add/choose-thing-type.vue'
import AddThingPage from '../pages/settings/things/add/thing-add.vue'

import InboxListPage from '../pages/settings/inbox/inbox-list.vue'

import SemanticModelPage from '../pages/settings/model/model.vue'

import RuleEditPage from '../pages/settings/rules/rule-edit.vue'
import RuleConfigureModulePage from '../pages/settings/rules/rule-configure-module.vue'

import Analyzer from '../pages/analyzer/analyzer.vue'

import MasterDetailMaster from '../pages/master-detail-master.vue'
import MasterDetailDetail from '../pages/master-detail-detail.vue'

import DeveloperToolsPage from '../pages/developer/developer-tools.vue'

export default [
  {
    path: '/',
    component: HomePage,
    options: {
      animate: false
    }
    // tabs: [
    //   {
    //     path: '/',
    //     id: 'tab-overview',
    //     content: `
    //     <div class="block">
    //       <p>Tab 1 content</p>
    //       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium voluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad laboriosam accusamus?</p>
    //       <p>Saepe explicabo voluptas ducimus provident, doloremque quo totam molestias! Suscipit blanditiis eaque exercitationem praesentium reprehenderit, fuga accusamus possimus sed, sint facilis ratione quod, qui dignissimos voluptas! Aliquam rerum consequuntur deleniti.</p>
    //       <p>Totam reprehenderit amet commodi ipsum nam provident doloremque possimus odio itaque, est animi culpa modi consequatur reiciendis corporis libero laudantium sed eveniet unde delectus a maiores nihil dolores? Natus, perferendis.</p>
    //     </div>
    //     `,
    //     component: OverviewTab
    //   },
    //   {
    //     path: '/locations/',
    //     id: 'tab-locations',
    //     component: LocationsTab
    //   },
    //   {
    //     path: '/equipments/',
    //     id: 'tab-equipments',
    //     component: EquipmentsTab
    //   },
    //   {
    //     path: '/properties/',
    //     id: 'tab-properties',
    //     component: PropertiesTab
    //   }
    // ]
  },
  {
    path: '/setup/',
    loginScreen: {
      component: SetupWizard
    }
  },
  {
    path: '/sitemap/:sitemapId/:pageId',
    component: SitemapPage
  },
  {
    path: '/about/',
    component: AboutPage,
    options: {
      animate: false
    }
  },
  {
    path: '/form/',
    component: FormPage,
    options: {
      animate: false
    }
  },
  {
    path: '/setup-wizard/',
    component: SetupWizardPage,
    options: {
      animate: false
    }
  },
  {
    path: '/settings/',
    component: SettingsMenuPage,
    routes: [
      {
        path: 'items',
        component: ItemsListPage,
        routes: [
          {
            path: ':itemName',
            component: ItemDetailsPage,
            routes: [
              {
                path: 'edit',
                component: ItemEditPage
              }
            ]
          }
        ]
      },
      // {
      //   path: 'items-virtual',
      //   component: ItemsVirtualListPage,
      //   routes: [
      //     {
      //       path: ':itemName',
      //       component: ItemDetailsPage,
      //       routes: [
      //         {
      //           path: 'edit',
      //           component: ItemEditPage
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: 'things/',
        component: ThingsListPage,
        routes: [
          {
            path: 'add',
            component: AddThingChooseBindingPage,
            routes: [
              {
                path: ':bindingId',
                component: AddThingChooseThingTypePage,
                routes: [
                  {
                    path: ':thingTypeId',
                    component: AddThingPage
                  }
                ]
              }
            ]
          },
          {
            path: ':thingId',
            component: ThingDetailsPage
          }
        ]
      },
      {
        path: 'model',
        component: SemanticModelPage
        // routes: [
        //   {
        //     path: ':itemName',
        //     component: ItemDetailsPage,
        //     routes: [
        //       {
        //         path: 'edit',
        //         component: ItemEditPage
        //       }
        //     ]
        //   }
        // ]
      },
      {
        path: 'rules/',
        component: RuleEditPage,
        routes: [
          {
            path: 'add',
            component: RuleEditPage
          },
          {
            path: 'module',
            component: RuleConfigureModulePage
          },
          {
            path: ':ruleId',
            component: RuleEditPage
          }
        ]
      },
      {
        path: 'inbox/',
        component: InboxListPage,
        routes: [
          // {
          //   path: 'add',
          //   component: AddonsAddPage
          // }
        ]
      },
      {
        path: 'addons/:addonType',
        component: AddonsListPage,
        routes: [
          {
            path: 'add',
            component: AddonsAddPage
          }
        ]
      },
      {
        path: 'services/:serviceId',
        component: ServiceSettingsPage
      }
    ]
  },
  {
    path: '/developer/',
    component: DeveloperToolsPage,
    options: {
      animate: false
    }
  },
  // {
  //   path: '/setup-wizard/',
  //   component: SetupWizardPage,
  // },
  {
    path: '/master-detail/',
    component: MasterDetailMaster,
    master: true,
    detailRoutes: [
      {
        path: '/master-detail/:id/',
        component: MasterDetailDetail
      }
    ]
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage
  },
  {
    path: '/analyzer/',
    popup: {
      component: Analyzer
    }
  },
  /* For Cordova */
  {
    path: '/static/(.*)',
    redirect: '/'
  },
  // temp disable
  // {
  //   path: '/android_asset/(.*)',
  //   redirect: '/'
  // },
  // {
  //   path: '/var/containers/(.*)',
  //   redirect: '/'
  // },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
