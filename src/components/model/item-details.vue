<template>
  <f7-card v-if="model">
    <f7-card-header>Item</f7-card-header>
    <f7-card-content>
      <f7-list media-list>
        <ul>
          <f7-list-item
            media-item
            class="itemlist-item"
            :link="'/settings/items/' + model.item.name"
            :title="(model.item.label) ? model.item.label : model.item.name"
            :footer="(model.item.label) ? model.item.name : '\xa0'"
            :subtitle="getItemTypeAndMetaLabel(model.item)"
            :after="model.item.state"
          >
            <oh-icon v-if="model.item.category" slot="media" :icon="model.item.category" height="32" width="32" />
            <span v-else slot="media" class="item-initial">{{model.item.name[0]}}</span>
            <f7-icon v-if="!model.item.editable" slot="after-title" f7="lock_fill" size="1rem" color="gray"></f7-icon>
          </f7-list-item>
          <f7-list-button color="blue" title="Edit Item">Edit Item</f7-list-button>
        </ul>
      </f7-list>
    </f7-card-content>

  </f7-card>
</template>

<script>
export default {
  props: ['model', 'links'],
  data () {
    return {
    }
  },
  methods: {
    getItemTypeAndMetaLabel (item) {
      let ret = item.type
      if (item.metadata && item.metadata.semantics) {
        ret += ' · '
        const classParts = item.metadata.semantics.value.split('_')
        ret += classParts[0]
        if (classParts.length > 1) {
          ret += '>' + classParts.pop()
        }
      }
      return ret
    }
  }
}
</script>
