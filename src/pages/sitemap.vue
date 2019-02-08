<template>
  <f7-page class="sitemap">
    <f7-navbar :back-link="(sitemapId !== pageId) ? 'Back' : null">
      <f7-nav-left v-if="sitemapId === pageId">
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title v-if="sitemap.title">{{sitemap.title}}</f7-nav-title>
    </f7-navbar>
    <f7-block class="block-narrow" v-if="sitemap.widgets">
      <f7-row>
        <f7-col>
          <f7-list v-if="sitemap.widgets[0].type !== 'Frame'">
            <ul>
              <sitemap-widget-generic :model="sitemap" :sitemapId="sitemapId" :pageId="pageId"/>
            </ul>
          </f7-list>
          <sitemap-widget-generic v-else :model="sitemap" :sitemapId="sitemapId" :pageId="pageId"/>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
// import SitemapWidgetGeneric from '../components/sitemap/widget-generic.vue'

export default {
  // components: {
  //   SitemapWidgetGeneric
  // },
  props: ["sitemapId", "pageId"],
  data() {
    return {
      sitemap: {}
    };
  },
  created() {
    fetch("/rest/sitemaps/" + this.sitemapId + "/" + this.pageId).then(resp => {
      const json = resp.json();
      json.then(j => {
        this.sitemap = j;
      });
    });
  }
};
</script>

<style lang="stylus">
.sitemap .block {
  padding: 0;
  margin: 0;
}
</style>
