<template>
  <f7-block v-if="model && !model.type">
    <component v-for="widget in model.widgets" :name="widget.widgetId" :key="widget.widgetId" :is="componentType" :model="widget" :sitemap-id="sitemapId" :page-id="pageId" />
  </f7-block>
  <f7-block v-else-if="model && model.type === 'Frame'">
    <f7-block-title>{{model.label}}</f7-block-title>
    <f7-list>
      <!-- <f7-list-item v-for="widget in model.widgets" :name="widget.widgetId" :key="widget.widgetId" :title="widget.label" :model="widget" /> -->
      <ul>
        <component v-for="widget in model.widgets" :name="widget.widgetId" :key="widget.widgetId" :is="componentType" :model="widget" :sitemap-id="sitemapId" :page-id="pageId" />
      </ul>
    </f7-list>
  </f7-block>
  <f7-list-item v-else :title="title" :after="state" :link="link">
    <img v-if="model.icon" slot="media" :src="'/icon/' + model.icon + '?format=svg'" height="32" width="32" />
    <f7-toggle style="margin-left: 10px" v-if="model.type === 'Switch'" />
    <f7-stepper style="margin-left: 10px" v-if="model.type === 'Setpoint'" color="blue" small></f7-stepper>
    <f7-list-item-cell v-if="model.type === 'Slider'">
      <f7-range
        :min="0"
        :max="100"
        :step="1"
        :value="10"
      ></f7-range>
    </f7-list-item-cell>
  </f7-list-item>
  <!-- <f7-list-item v-else :title="title" :after="state">
    <img v-if="model.icon" slot="media" :src="'/icon/' + model.icon + '?format=svg'" width="32" />
  </f7-list-item> -->
</template>

<script>
export default {
  props: [
    'model',
    'sitemapId',
    'pageId',
  ],
  data () {
    return {
      title: '',
      state: '',
      link: null
    }
  },
  created () {
    if (this.model && this.model.label) {
      let splittedlabel = this.model.label.split(' [')
      this.title = splittedlabel[0]
      if (splittedlabel[1]) {
        this.state = splittedlabel[1].replace(/\]$/, '')
      }
    }

    if (this.model && this.model.linkedPage) {
      this.link = '/sitemap/' + this.sitemapId + '/' + this.model.linkedPage.id
    }
  },
  computed: {
    componentType () {
      return 'sitemap-widget-generic'
    }
  }
}
</script>
