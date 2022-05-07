<template>
  <a-modal
    :visible="add_node_visible"
    title="新增节点"
    cancelText="取消"
    okText="确定"
    @cancel="cancel"
    @ok="ok"
  ><form id="myForm">
    输入节点名称<a-input placeholder="请填写节点名称" id='entityAddName' class="inputName" ref="getValue"/>
    <a-select mode="tags" id="typeSelector" style="width: 120px" placeholder="请选择类型" @change="onChange">
      <a-select-option v-for="type in this.entity_types" :key="type" :name="type" :value="type">
        {{type}}
      </a-select-option>
    </a-select>

  </form>
  </a-modal>
</template>

<script>
import {mapGetters} from "vuex";
import $ from 'jquery';
export default {
  name: "add_Node_Moduel",
  data(){
    return{
      type:"",
      type_selected:false,
    }
  },
  mounted(){
  },

  methods:{
    onChange(value){
      //TODO: 默认只使用第一种类型，考虑后续添加一个节点多类型的情况。
      this.type_selected=true;
      this.type=value[0];
    },
    ok(){
      var name=entityAddName.value;
      //var node_id=this.nodes[this.nodes.length-1].id+1;
      //TODO: 向后台发送请求，得到id；
      if(name!==""&&this.type_selected){
        //let obj={name:name, type:this.type, id:node_id};

        //this.$store.commit('set_Add_Entity', obj);
        let obj={name:name, type:this.type, properties: {}, relatesTo: {}};
        this.$store.dispatch('addEntity',obj);
      }else if(name===""){
        alert("名字不可为空");
      }else if(!this.type_selected){
        alert("未选择类型");
      }
      this.$store.commit('set_Add_Node_Visible', false);
    },
    cancel(){
      this.$store.commit('set_Add_Node_Visible', false);
    },

  },
  computed:{
    ...mapGetters([
      'add_node_visible',
      'nodes',
      'links',
      'entity_types',
    ])
  },
}
</script>

<style scoped>
.inputName{
  width:200px;
}
</style>
