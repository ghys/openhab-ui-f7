import HomePage from '../pages/home.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
import DynamicRoutePage from '../pages/dynamic-route.vue';
import NotFoundPage from '../pages/not-found.vue';

import SitemapPage from '../pages/sitemap.vue';

//import SetupWizardPage from '../pages/setup-wizard.vue';
import SettingsMenuPage from '../pages/settings/settings-menu.vue';
import ServiceSettingsPage from '../pages/settings/services/service-settings.vue';
import AddonsListPage from '../pages/settings/addons/addons-list.vue';
import AddonsAddPage from '../pages/settings/addons/addons-add.vue';

import ItemsListPage from '../pages/settings/items/items-list.vue';

import ThingsListPage from '../pages/settings/things/things-list.vue';
import ThingDetailsPage from '../pages/settings/things/thing-details.vue';


export default [
  {
    path: '/',
    component: HomePage,
    options: {
      animate: false
    }
  },
  {
    path: '/sitemap/:sitemapId/:pageId',
    component: SitemapPage
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
    options: {
      animate: false
    }
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
          },
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
  // {
  //   path: '/setup-wizard/',
  //   component: SetupWizardPage,
  // },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
