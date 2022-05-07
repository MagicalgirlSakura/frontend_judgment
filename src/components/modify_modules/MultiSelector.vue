<template>
  <a-select
    mode="multiple"
    placeholder="类型过滤"
    :value="selectedItems"
    style="width: 100%"
    @change="handleChange"
  >
    <a-select-option v-for="item in filteredOptions" :key="item" :value="item">
      {{ item }}
    </a-select-option>
  </a-select>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  beforeMount() {
    this.former_entity_types=this.$store.getters.entity_types;
  },
  data() {
    return {
      selectedItems: [],
      former_entity_types:[],
      loaded:false,
    };
  },
  computed: {
    ...mapGetters([
      'entity_types',
    ]),
    filteredOptions() {
      return this.entity_types.filter(o => !this.selectedItems.includes(o));
    },
  },
  mounted(){
    this.mounted=true;
  },
  methods: {
    handleChange(selectedItems) {
      this.selectedItems = selectedItems;
      this.$store.commit('set_highlight',this.selectedItems);
    },
  },

};
</script>
