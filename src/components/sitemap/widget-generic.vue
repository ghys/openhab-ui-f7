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
    <oh-icon v-if="model.icon" slot="media" :icon="model.icon" height="32" width="32" />
    <f7-segmented round v-if="model.type === 'Rollershutter' || (model.item && model.item.type === 'Rollershutter')">
      <f7-button round icon-size="18" icon-f7="chevron_down" color="blue"></f7-button>
      <f7-button round icon-size="18" icon-f7="close_round_fill" color="blue"></f7-button>
      <f7-button round icon-size="18" icon-f7="chevron_up" color="blue"></f7-button>
    </f7-segmented>
    <f7-toggle style="margin-left: 10px" color="blue" v-else-if="model.type === 'Switch'" />
    <f7-stepper class="sitemap-stepper"
      style="margin-left: 10px"
      v-if="model.type === 'Setpoint'"
      color="blue" small
      :value="parseFloat(state)"></f7-stepper>
    <f7-list-item-cell style="max-width: 40%" v-else-if="model.type === 'Slider'">
      <f7-range
        :min="0"
        :max="100"
        :step="1"
        :value="state"
      ></f7-range>
    </f7-list-item-cell>
  </f7-list-item>
  <!-- <f7-list-item v-else :title="title" :after="state">
    <img v-if="model.icon" slot="media" :src="'/icon/' + model.icon + '?format=svg'" width="32" />
  </f7-list-item> -->
</template>

<style lang="stylus">
.sitemap-stepper
  .stepper-input-wrap input, .stepper-value
    width 45px !important
    color #007aff !important
    font-size var(--f7-stepper-value-font-size) !important
    height 22px !important
.aurora .sitemap-stepper .stepper-input-wrap input, .stepper-value
    margin-top -2px
</style>

<script>
export default {
  props: [
    'model',
    'sitemapId',
    'pageId'
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

    this.hasIcon = (this.model && this.model.icon)
  },
  computed: {
    componentType () {
      return 'sitemap-widget-generic'
    }
  },
  asyncComputed: {
    iconUrl () {
      if (!this.model || !this.model.icon) return Promise.resolve('')
      return this.$oh.media.getIcon(this.model.icon)
    }
  }
}
</script>
