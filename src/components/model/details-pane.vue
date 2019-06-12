<template>
  <div>
    <f7-block-title>Item</f7-block-title>
    <item-details :model="model" :links="links" />
    <f7-block-title>Classification</f7-block-title>
    <f7-card>
      <f7-card-content>
        <semantics-picker :item="model.item" :same-class-only="true" />
      </f7-card-content>
    </f7-card>
    <f7-block-title>Channel Links</f7-block-title>
    <link-details :model="model" :links="links" />
  </div>
</template>

<script>
import ItemDetails from '@/components/model/item-details.vue'
import LinkDetails from '@/components/model/link-details.vue'
import SemanticsPicker from '@/components/item/semantics-picker.vue'

export default {
  props: ['model', 'links'],
  components: {
    ItemDetails,
    LinkDetails,
    SemanticsPicker
  }
}
</script>
