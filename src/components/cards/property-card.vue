<template>
  <f7-card expandable card-tablet-fullscreen v-on:card:opened="cardOpening" v-on:card:closed="cardClosed">
    <f7-card-content :padding="false">
      <div :class="`bg-color-${color}`" :style="{height: '300px'}">
        <f7-card-header text-color="white" class="display-block">
          {{title || 'Something'}}
          <div><small v-if="subtitle">{{subtitle}}</small></div>
          <br>
          <h1>State</h1>
        </f7-card-header>
        <f7-link
          card-close
          color="white"
          class="card-opened-fade-in"
          :style="{position: 'absolute', right: '15px', top: '15px'}"
          icon-f7="close_round_fill"
        ></f7-link>
      </div>
      <div class="card-content-padding" v-if="opened">
        <f7-block>
          <div class="row">
            <div class="col-50 tablet-75"></div>
            <div class="col-50 tablet-25">
              <f7-button outline round :color="color" :href="`/analyzer/?items=${sitemapModels.map((m) => m.item).join(',')}`">Analyze{{sitemapModels.length > 1 ? ' all' : ''}}</f7-button>
            </div>
          </div>
        </f7-block>
      </div>
      <div class="card-content-padding" v-if="opened">
        <f7-list>
          <ul>
            <sitemap-widget-generic v-for="model in sitemapModels" :key="model.item"
              :model="model" />
          </ul>
        </f7-list>
        <p>
          <f7-button fill round large card-close :color="color">Close</f7-button>
        </p>
      </div>
    </f7-card-content>
  </f7-card>
</template>

<script>
import item2SitemapModel from './item2SitemapModel.js'

export default {
  props: ['color', 'type', 'header', 'title', 'subtitle', 'items'],
  data () {
    return {
      opened: false
    }
  },
  methods: {
    cardOpening () {
      console.log('card opened')
      setTimeout(() => { this.opened = true })
    },
    cardClosed () {
      console.log('card closed')
      this.opened = false
    }
  },
  computed: {
    sitemapModels () {
      return this.items.map(item2SitemapModel)
    }
  }
}
</script>
