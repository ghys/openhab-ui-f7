<template>
  <f7-card v-if="model">
    <f7-card-content>
      <f7-list media-list>
        <ul>
          <item :item="model.item" :link="'/settings/items/' + model.item.name" />
          <!-- <f7-list-item
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
          </f7-list-item> -->
          <f7-list-button v-if="!editMode" color="blue" title="Edit Item" @click="editMode = true">Edit Item</f7-list-button>
        </ul>
      </f7-list>

      <div class="padding-top" v-if="editMode">
        <quick-new-item-form :new-item="model.item" :hide-type="true"></quick-new-item-form>
        <f7-button filled color="blue" @click="save">Save</f7-button>
      </div>
    </f7-card-content>

  </f7-card>
</template>

<script>
import Item from '@/components/item/item.vue'
import QuickNewItemForm from '@/components/item/quick-new-item-form.vue'

export default {
  props: ['model', 'links'],
  components: {
    Item,
    QuickNewItemForm
  },
  data () {
    return {
      editMode: false
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
    },
    save () {
      this.editMode = false
    }
  },
  watch: {
    model () {
      this.editMode = false
    }
  }
}
</script>
