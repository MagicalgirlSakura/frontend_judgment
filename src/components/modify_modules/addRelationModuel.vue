<template>
  <div>
    <a-modal
      :visible="add_relation_visible"
      title="新增关系"
      cancelText="取消"
      okText="确定"
      @cancel="cancel"
      @ok="ok"
    >
      <a-select
        label-in-value
        placeholder=请选择
        style="width: 120px"
        @change="SourceChange"
      >
        <a-select-option v-for="node in this.nodes" :key="node.id" :name="node.name" :value="node.id">
          {{node.name}}
        </a-select-option>
      </a-select>
      <a-input placeholder="请填写关系名称" class="relationInput" id='relationAddName' ref="getValue"/>
      <a-select
        label-in-value
        placeholder=请选择
        style="width: 120px"
        @change="TargetChange"
      >
        <a-select-option v-for="node in this.nodes" :key="node.id" :name="node.name" :value="node.id">
          {{node.name}}
        </a-select-option>
      </a-select>


    </a-modal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "addRelationModuel",
  data(){
    return{
      "source":"",
      "target":"",
    }
  },
  computed:{
    ...mapGetters([
      'add_relation_visible',
      'nodes',
      'links',
    ])
  },
  methods:{
    SourceChange(key) {
      this.source=key.key;
    },
    TargetChange(key){
      this.target=key.key;
    },
    ok(){
      var RelationName=relationAddName.value;
      var obj={"source": this.source, "target": this.target, "relation": RelationName};
      this.$store.dispatch('addRelation', obj);
      this.$store.commit('set_Add_Relation_Visible', false);
    },
    cancel(){
      this.$store.commit('set_Add_Relation_Visible', false);
    },

  }
}
</script>

<style scoped>
.relationInput{
  width: 200px;
}
</style>


