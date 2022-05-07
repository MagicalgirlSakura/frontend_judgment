
import{
  findAllRelationAPI,
  addRelationshipAPI,
  deleteRelationshipAPI,
  updateRelationAPI,
} from"@/api/relation";
import { message } from 'ant-design-vue'
import entity from "./entity";

const relation={
  state:{
    //预定义的图谱数据
    relationList:[
      {source:'1000',target:'1001'},
      {source:'1000',target:'1002'},
      {source:'1000',target:'1003'},
      {source:'1000',target:'1004'},
      {source:'1000',target:'1005'},
      {source:'1000',target:'1006'},
      {source:'2000',target:'2001'},
      {source:'2000',target:'2002'},
      {source:'2000',target:'1003'},
      {source:'2000',target:'2004'},
      {source:'2000',target:'2005'},
      {source:'2000',target:'2006'}
    ],
    modify_relation_visible:false,
    add_relation_visible:false,
    link_text_font_size:15,
    link_text_visible:true,
  },
  mutations:{
    initialRelationList: function(state){
      for(var i in state.relationList){
        state.relationList[i].source=state.relationList[i].source.id;
        state.relationList[i].target=state.relationList[i].target.id;
      }
    },
    findNodesForLinks: function(state){
      var nodes=entity.state.entityList;
      var map=new Map(nodes.map(function(d){
        return [d.id,d];
      }))
      for(var i in state.relationList){
        state.relationList[i].source=map.get(state.relationList[i].source);
        state.relationList[i].target=map.get(state.relationList[i].target);
      }
    },
    set_link_text_font_size: function(state,data){
      state.link_text_font_size=data;
      window.initGraph();
    },
    set_link_text_visible: function(state,data){
      state.link_text_visible=data;
      window.initGraph();
    },
    set_RelationList: function(state, data){
      state.relationList=data;

    },
    delete_Relation_By_Id: function(state, data){
      for(let i = 0; i<state.relationList.length;i++){
        if(data===state.relationList[i].id){
          state.relationList.splice(i,1);
          break;
        }
      }

    },
    set_Modify_Relation_Visible: function(state, data){
      state.modify_relation_visible=data;
    },
    set_Add_Relation_Visible: function(state, data){
      state.add_relation_visible=data;
    },
    set_Update_Relation: function(state, data){
      state.relationList[data.index]=data;
    },
    set_Add_Relation: function(state, data){
      state.relationList.push(data);
    }

  },
  actions:{
    /*getAllRelationList: async ({commit})=>{
      const res=await findAllRelationAPI()
      if(res){
        commit('set_RelationList',res)
      }
      window.initGraph();
    },*/
    updateRelation: async ({commit},data)=>{
      const obj={id:data.id};
      const res=await updateRelationAPI(obj, data);
      if(res){
        commit('set_Update_Relation',data);
        window.initGraph();
      }
    },
    addRelation: async ({commit},data)=>{
      const res=await addRelationshipAPI(data)
      if(res){

        commit('set_Add_Relation',data);
        window.initGraph();
      }
    },
    deleteRelation: async ({commit},data)=>{
      const res=await deleteRelationshipAPI(data)
      if(res){
        commit('delete_Relation_By_Id',data.id);
        window.initGraph();
      }
    },
  }
}

export default relation;
