<template>
  <div v-if="showCards">
    <div class="demo-expandable-cards">
      <equipments-card v-for="(items, equipmentType) in properties" :key="equipmentType"
        :title="equipmentType" :items="items" :subtitle="`${items.length} equipment${items.length > 1 ? 's' : ''}`" :color="color(equipmentType)" />
    </div>
  </div>
</template>

<script>
import EquipmentsCard from '../../components/cards/equipments-card.vue'

export default {
  components: {
    EquipmentsCard
  },
  data () {
    return {
      showCards: false,
      properties: []
    }
  },
  created () {
    this.$oh.api.get('/rest/items?metadata=semantics').then((data) => {
      this.showCards = true

      this.properties = data.filter((item, index, items) => {
        return item.metadata && item.metadata.semantics &&
          item.metadata.semantics &&
          item.metadata.semantics.value.indexOf('Equipment_') === 0
      }).reduce((prev, item, i, properties) => {
        const equipmentType = item.metadata.semantics.value.split('_')[1]
        if (!prev[equipmentType]) prev[equipmentType] = []
        const equipmentWithPoints = {
          item: item,
          points: data.filter((item2, index, items) => {
            return item2.metadata && item2.metadata.semantics &&
              item2.metadata.semantics && item2.metadata.semantics.config &&
              item2.metadata.semantics.config.isPointOf === item.name
          })
        }
        prev[equipmentType].push(equipmentWithPoints)
        return prev
      }, {})
    })
  },
  methods: {
    hideCards () {
      this.showCards = false
    },
    color (equipmentType) {
      if (equipmentType === 'HVAC') return 'red'
      if (equipmentType === 'Lightbulb') return 'yellow'
      if (equipmentType === 'Window') return 'blue'
      if (equipmentType === 'Door') return 'green'
      if (equipmentType === 'Camera') return 'pink'
      if (equipmentType === 'Blinds') return 'teal'
      if (equipmentType === 'SmokeDetector' || equipmentType === 'Siren') return 'deeppurple'
      // etc. - use a map
      return 'gray'
    }
  }
}
</script>
