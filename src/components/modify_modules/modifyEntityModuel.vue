<template>
  <a-modal
    v-if="modify_node_visible"
    :visible="modify_node_visible"
    title="编辑节点"
    cancelText="取消"
    okText="确定"
    @cancel="cancel"
    @ok="ok"
  >
    <div>
      当前节点名称:&nbsp{{this.nodes[cur_node]===undefined?"":this.nodes[cur_node].name}}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp类型:&nbsp{{this.nodes[cur_node]===undefined?"":this.nodes[cur_node].type}}
      <a-button type="danger" @click="deleteNode" style="margin-top:10px;float:right">删除节点</a-button>

      <br/><br/>
      修改节点名称：<a-input placeholder="请填写节点名称" class=”nameInput“ id='entityModifyName' ref="getValue"/><br/>
      修改节点类型：<a-select
        mode="tags"
        placeholder=请选择
        style="width: 160px"
        @change="onChange"
      >
        <a-select-option v-for="type in this.entity_types" :key="type" :name="type" :value="type">
          {{type}}
        </a-select-option>
      </a-select>
      <a-button type="normal" @click="switchFocus" style="float:right">切换为焦点</a-button>
    </div>
    <div>
      属性：
      <a-table bordered :data-source="dataSource" :columns="columns">
        <template slot="property" slot-scope="text, record">
          <editable-cell :text="text" @change="onCell1Change(record.key, 'property', $event)" />
        </template>
        <template slot="content" slot-scope="text, record">
          <editable-cell :text="text" @change="onCell1Change(record.key, 'content', $event)" />
        </template>

        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="() => onDelete(record.key)"
          >
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
      <a-button class="editable-add-btn" @click="handleAdd">
        Add
      </a-button>
    </div>

  </a-modal>
</template>

<script>
import {mapGetters} from "vuex";
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: false,
    };
  },

  methods: {

    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};

export default {
  name: "modify_Entity_Model",
  components: {
    EditableCell,
  },
  props:{
    cur_node:{
      required:true,
    }
  },
  data(){
    return{
      new_type:"",
      type_changed:false,
      dataSource:[],
      dataSourceOrigin:[],
      count:2,
      columns: [
        {
          title: 'property',
          dataIndex: 'property',
          width: '30%',
          scopedSlots: { customRender: 'property' },
        },
        {
          title: 'content',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' },
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    }
  },
  watch:{
    current_node(newValue,oldValue){
      if(newValue!==-1){
        var propertiesList = JSON.parse(JSON.stringify(this.nodes[this.cur_node])).properties;
        var index=0;
        for(let key in propertiesList){
          this.dataSourceOrigin.push({"key":index, "property":key, "content":propertiesList[key]});
          index++;
        }
      }
      this.dataSource=JSON.parse(JSON.stringify(this.dataSourceOrigin));
    }
  },
  methods:{
    switchFocus(){
      this.$store.dispatch('getAllEntityList',this.nodes[this.cur_node].id);
      this.cancel();
    },
    onCell1Change(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter(item => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },

    onChange(value){
      this.type_changed=true;
      this.new_type=value[0];
    },
    ok(){
      var obj=JSON.parse(JSON.stringify(this.nodes[this.current_node]));
      //修改类型
      if(this.type_changed){
        obj.type=this.new_type;
      }
      //修改名称
      var name=entityModifyName.value;
      if(name!==""){
        obj.name=name;
      }
      //修改属性
      var properties={}
      for(var i in this.dataSource){
        let key=this.dataSource[i].property;
        let value=this.dataSource[i].content;
        properties[key]=value;
      }
      obj.properties=properties;

      this.$store.dispatch('updateNode', obj);
      this.$store.commit('set_current_node', -1);
      this.$store.commit('set_Modify_Node_Visible', false);
      this.dataSource=[];
      this.dataSourceOrigin=[];
      this.$parent.initGraph();
    },
    cancel(){
      this.dataSource=[];
      this.dataSourceOrigin=[];
      this.$store.commit('set_current_node', -1);
      this.$store.commit('set_Modify_Node_Visible', false);
    },

    deleteNode(){
      let that=this
      if (confirm("确认要删除？")) {
        let i=0;
        var relationsId=[];
        for(i=0;i<that.links.length;i++){
          if(that.links[i].target.index==that.cur_node){
            let obj={source:that.links[i].source.id, target:that.links[i].target.id, name:that.links[i].relation, id:that.links[i].id};
            relationsId.push(obj);
          }
          else if(that.links[i].source.index==that.cur_node){
            let obj={source:that.links[i].source.id, target:that.links[i].target.id, name:that.links[i].relation, id:that.links[i].id};
            relationsId.push(obj);
          }
        }
        for(let i=0; i<relationsId.length;i++){
          this.$store.dispatch('deleteRelation', relationsId[i]);
        }

        this.$store.dispatch('deleteEntity', that.nodes[that.cur_node]);
        that.$parent.initGraph();
        that.$store.commit('set_Modify_Node_Visible', false);
      }
    }
  },
  computed:{
    ...mapGetters([
      'current_node',
      'modify_node_visible',
      'nodes',
      'links',
      'entity_types',
    ]),
    // dataSource:{
    //   get(){
    //     if(this.cur_node!==-1){
    //       var propertiesList = JSON.parse(JSON.stringify(this.nodes[this.cur_node])).properties;
    //       var list=[];
    //       var index=0;
    //       for(let key in propertiesList){
    //         list.push({"key":index, "property":key, "content":propertiesList[key]});
    //         index++;
    //       }
    //       return list;
    //     }else{
    //       return null;
    //     }
    //   },
    //   set(){
    //   }
    // },
    former_type: function(){
      return this.nodes[this.cur_node].type;
    }
  },
}
</script>

<style scoped>
.”nameInput“{
  width: 160px;
}
</style>
