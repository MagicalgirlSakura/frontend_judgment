<template>
  <a-modal
    :visible="modify_relation_visible"
    title="编辑关系"
    cancelText="取消"
    okText="确定"
    @cancel="cancel"
    @ok="ok"
  >
    <a-button type="danger" @click="deleteRelation">删除关系</a-button><br/><br/>
    修改关系名称<a-input placeholder="请填写关系名称" id='relationModifyName' ref="getValue"/>
  </a-modal>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "modifyRelationModuel",
  props:{
    cur_relation:{
      required:true,
    }
  },
  data(){
    return{
      current_relation:-1,
    }
  },
  mounted(){
  },

  methods:{
    ok(){
      var name=relationModifyName.value;
      var new_rel=JSON.parse(JSON.stringify(this.links[this.cur_relation]));
      new_rel.source=new_rel.source.id;
      new_rel.target=new_rel.target.id;
      new_rel.relation=name;
      this.$store.dispatch('updateRelation', new_rel);
      this.$store.commit('set_Modify_Relation_Visible', false);
      window.initGraph();
    },
    cancel(){
      this.$store.commit('set_Modify_Relation_Visible', false);
    },
    deleteRelation(){

      let that=this
      if (confirm("确认要删除？")) {
        var data={id:that.links[that.cur_relation].id,
          source:that.links[that.cur_relation].source.id,
          target:that.links[that.cur_relation].target.id ,
          name:that.links[that.cur_relation].relation }
        this.$store.dispatch('deleteRelation', data);
        window.initGraph();
        that.$store.commit('set_Modify_Relation_Visible', false);
      }
    }
  },
  computed:{
    ...mapGetters([
      'modify_relation_visible',
      'nodes',
      'links',
    ])
  },
}
</script>

<style scoped>

</style>

