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

import ItemsListPage from '../pages/settings/items/items-list.vue'
import ItemsVirtualListPage from '../pages/settings/items/items-list-vlist.vue'
import ItemDetailsPage from '../pages/settings/items/items-details.vue'

import ThingsListPage from '../pages/settings/things/things-list.vue'
import ThingDetailsPage from '../pages/settings/things/thing-details.vue'

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
    component: SetupWizardPage
  },
  {
    path: '/settings/',
    component: SettingsMenuPage,
    options: {
      animate: false
    },
    routes: [
      {
        path: 'items',
        component: ItemsListPage,
        routes: [
          {
            path: ':itemName',
            component: ItemDetailsPage
          }
        ]
        // routes: [
        //   {
        //     path: 'add',
        //     component: AddonsAddPage
        //   }
        // ]
      },
      {
        path: 'items-virtual',
        component: ItemsVirtualListPage,
        routes: [
          {
            path: ':itemName',
            component: ItemDetailsPage
          }
        ]
        // routes: [
        //   {
        //     path: 'add',
        //     component: AddonsAddPage
        //   }
        // ]
      },
      {
        path: 'things/',
        component: ThingsListPage,
        routes: [
          {
            path: ':thingId',
            component: ThingDetailsPage
          }
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
  {
    path: '/android_asset/(.*)',
    redirect: '/'
  },
  {
    path: '/var/containers/(.*)',
    redirect: '/'
  },
  {
    path: '(.*)',
    component: NotFoundPage
  }
]
