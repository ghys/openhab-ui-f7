<template>
  <div v-if="showCards">
    <div class="demo-expandable-cards">
      <location-card v-for="location in locations.filter((l) => l.equipments.length > 0 || l.properties.length > 0)" :key="location.item.name"
        :title="location.item.label" :items="location" :subtitle="parentLocationName(location.item)" :color="color(location.item)" />
    </div>
  </div>
</template>

<script>
import LocationCard from '../../components/cards/location-card.vue'

export default {
  components: {
    LocationCard
  },
  data () {
    return {
      showCards: false,
      locations: []
    }
  },
  created () {
    this.$oh.api.get('/rest/items?metadata=semantics').then((data) => {
      this.showCards = true

      this.locations = data.filter((item, index, items) => {
        return item.metadata && item.metadata.semantics &&
          item.metadata.semantics.value.indexOf('Location_') === 0
      }).sort((a, b) => {
        const titleA = a.label || a.name
        const titleB = b.label || b.name
        return titleA.localeCompare(titleB)
      }).map((l) => {
        return {
          item: l,
          properties: data.filter((item, index, items) => {
            return item.metadata && item.metadata.semantics &&
              item.metadata.semantics && item.metadata.semantics.config &&
              item.metadata.semantics.config.relatesTo &&
              item.metadata.semantics.config.hasLocation === l.name
          }),
          equipments: data.filter((item, index, items) => {
            return item.metadata && item.metadata.semantics &&
              item.metadata.semantics && item.metadata.semantics.config &&
              item.metadata.semantics.value.indexOf('Equipment_') === 0 &&
              item.metadata.semantics.config.hasLocation === l.name
          }).map((item) => {
            return {
              item: item,
              points: data.filter((item2, index, items) => {
                return item2.metadata && item2.metadata.semantics &&
                  item2.metadata.semantics && item2.metadata.semantics.config &&
                  item2.metadata.semantics.config.isPointOf === item.name
              })
            }
          })
        }
      })
    })
  },
  methods: {
    hideCards () {
      this.showCards = false
    },
    color (item) {
      if (item.metadata.semantics.value.indexOf('LivingRoom') > 0) return 'orange'
      if (item.metadata.semantics.value.indexOf('Kitchen') > 0) return 'deeporange'
      if (item.metadata.semantics.value.indexOf('Bedroom') > 0) return 'pink'
      if (item.metadata.semantics.value.indexOf('Bathroom') > 0) return 'blue'
      if (item.metadata.semantics.value.indexOf('_Room') > 0) return 'lightblue'
      if (item.metadata.semantics.value.indexOf('_Floor') > 0) return 'deeppurple'
      if (item.metadata.semantics.value.indexOf('_Outdoor') > 0) return 'green'
      return 'gray'
    },
    parentLocationName (item) {
      if (item.metadata.semantics.config && item.metadata.semantics.config.isPartOf) {
        const parent = (this.locations.find((i) => i.item.name === item.metadata.semantics.config.isPartOf))
        return parent.item.label || parent.item.name
      }
      return ''
    }
  }
}
</script>
