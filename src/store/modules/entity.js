import{
  findAllEntityAPI,
  addEntityAPI,
  deleteEntityAPI,
  updateEntityAPI,
  entitySearchAPI,
} from"@/api/entity";
import{
  findAllRelationAPI,
  relationSearchAPI
}
from "../../api/relation";
import relation from "./relation";
import {updateLocationAPI} from "../../api/entity";
import {message} from "ant-design-vue";

const entity={
  state:{
    //预定义的图谱数据
    entityList:[

      {name:"周康", type:"被告人", id:'1000'},
      {name:"伙同他人监禁受害人", type:"犯罪结果", id:'1001'},
      {name:"累犯，从重处罚", type:"情节", id:'1002'},
      {name:"《中华人民共和国刑事诉讼法》", type:"法律条文", id:'1003'},
      {name:"非法拘禁罪", type:"罪名", id:'1004'},
      {name:"有期徒刑七个月", type:"主罚", id:'1005'},
      {name:"缓刑一年", type:"副罚", id:'1006'},
      {name:"杨文", type:"被告人", id:'2000'},
      {name:"指使他人监禁受害人", type:"犯罪结果", id:'2001'},
      {name:"从犯，从轻处罚", type:"情节", id:'2002'},
      {name:"《中华人民共和国刑法》第96条", type:"法律条文", id:'1003'},
      {name:"非法拘禁罪", type:"罪名", id:'2004'},
      {name:"有期徒刑六个月", type:"主罚", id:'2005'},
      {name:"缓刑一年", type:"副罚", id:'2006'}
    ],
    /* entityList:[], */
    entityTypes:["default"],
    modify_node_visible:false,
    add_node_visible:false,
    entity_distance:330,
    entity_radius:35,
    drag_fixed:false,
    type_setting_mode:false,
    high_light_types:[],
    current_node:{},
    enableUpdate:false,
    load_compelete:false,
    entity_text_font_size:18,
    force_or_not:false, //节点是否会随力的作用而运动，如果为false则锁死。
    boundary_check_or_not:false,
  },
  getters:{
    get_statistical_result(state){
      var len=state.entityList.length;
      var i,j,typenum=0,resultnum=0;
      var types= new Array();
      var results=new Array();
      var final_result="当前各类型节点数目分别为:\n";
      final_result += "节点总数:"+" "+len+"\n";
      //
      types[0]=state.entityList[0].type;
      results[0]=0;
      for(i=0;i<len;i++){
        //除第0项外，若当前项type与已有的项相同，则直接跳过，否则会导致结果数组里同一个type出现多次
        if((i>0)&&(types.indexOf(state.entityList[i].type)!=-1)){
          continue;
        }
        //说明当前i是个新的type，把它加到types表中
        else if(i>0){
          typenum++;
          types[typenum]=state.entityList[i].type;
        }
        //下面这个循环用于对同一type的entity进行计数
        for(j=i;j<len;j++){
          if(state.entityList[j].type==state.entityList[i].type){
            results[resultnum]++;
          }
        }
        //该类型节点全部计数完成，开始下一个（最终resultnum将等于类型的数量）
        resultnum++;
        results[resultnum]=0
      }
      for(i=0;i<resultnum;i++){
        final_result += types[i]+": "+results[i]+"\n";
      }
      return final_result;
    }
  },
  mutations:{
    set_boundary_check_or_not:function(state,data){
      state.boundary_check_or_not=data;
    },
    set_index_for_nodes: function(state){
      for(var i in state.entityList){
        state.entityList[i].index=i;
      }
    },
    set_lock_all_nodes: function(state){
      state.force_or_not=false;
      for(var i in state.entityList){
        state.entityList[i].fx=state.entityList[i].x;
        state.entityList[i].fy=state.entityList[i].y;
      }
    },
    set_unlock_all_nodes: function(state){
      state.force_or_not=true;
      for(var i in state.entityList){
        state.entityList[i].fx=null;
        state.entityList[i].fy=null;
      }
    },
    set_current_node: function(state,data){
      state.current_node=data;
    },
    set_highlight: function(state,data){
      state.hight_light_types=data;
      let list=state.entityList;
      if(data.length!==0){
        for(var i in list){
          if(data.indexOf(list[i].type)!==-1){
            list[i].selected=true;
          }else{
            list[i].selected=false;
          }
        }
      }
      else{
        for(var i in list){
          list[i].selected=true;
        }
      }
      window.initGraph();
    },
    set_type_setting_mode: function(state,data){
      state.type_setting_mode=data;
      //window.initGraph();
    },
    set_drag_fixed: function(state,data){
      state.drag_fixed=data;
      window.initGraph();
    },
    set_entity_radius: function(state,data){
      state.entity_radius=data;
      window.initGraph();
    },
    set_entity_distance: function(state,data){
      state.entity_distance=data;
      window.initGraph();
    },
    set_EntityList: function(state, data){
      for(var i in data){
        data[i].selected=true;
      }
      state.entityList=data;
    },
    set_Modify_Node_Visible: function(state, data){
      state.modify_node_visible=data;
    },
    set_delete_Entity_By_Id: function(state, data){
      state.entityList.splice(data,1);
    },
    set_Add_Node_Visible: function(state, data){
      state.add_node_visible=data;
    },
    set_Add_Entity: function(state, data){
      state.entityList.push(data);
    },
    set_Update_Types: function(state, data){
      state.entityTypes=data;
    },
    set_Update_Node: function(state,data) {
      var index=data.index;
      state.entityList.splice(index,1,data);
    },
    set_entity_text_font_size: function(state,data){
      state.entity_text_font_size=data;
      window.initGraph();
    }

  },
  actions:{
    updateNode: async ({commit},data)=>{
      const res = await updateEntityAPI(data);
      if(res){
        commit('set_Update_Node', data);
        commit('initialRelationList');
        window.initGraph();
      }
    },
    getAllEntityList: async ({state,commit},data)=>{
      commit('set_boundary_check_or_not',false);
      commit('set_loading_visible',true);
      const res=await findAllEntityAPI(data)
      if(res){
        //console.log(res)
        commit('set_EntityList',res)
        commit('set_index_for_nodes');
        var arr=state.entityTypes;
        let i=0;
        for(i=0; i<state.entityList.length;i++){
          if(arr.indexOf(state.entityList[i].type)===-1){
            arr.push(state.entityList[i].type);
          }
        }
        commit('set_Update_Types', arr);
      }

      const res2=await findAllRelationAPI(data)
      if(res2){
        //console.log(res2)
        commit('set_RelationList',res2)
      }
      commit('findNodesForLinks');
      //commit('transformToERData');
      state.load_compelete=true;

      commit('set_loading_visible',false);

      if(!state.type_setting_mode){
        window.initGraph();
      }else{
        window.initERGraph();
      }
    },
    addEntity: async ({state,commit},data)=>{
      const res=await addEntityAPI(data)
      if(res){
        res.selected=(state.high_light_types.indexOf(res.type)!=-1||state.high_light_types.length==0)?true:false;
        commit('set_Add_Entity',res)
        window.initGraph();
      }
    },
    deleteEntity: async ({commit},data)=>{
      const res=await deleteEntityAPI({"id": data.id})
      if(res){
        commit('set_delete_Entity_By_Id',data.index)
        window.initGraph();
      }
    },
    updateLocation: async({commit},data)=>{
      const res=await updateLocationAPI(data);
        if(res){
        }
      },
    saveLocation: async({commit},data)=>{
      const res=await updateLocationAPI(data);
      if(res){
        message.success("保存成功");
      }
    },
    search: async({commit,state},data)=>{
      var res1 =await entitySearchAPI(data.value);
      commit('set_EntityList',res1);
      commit('set_RelationList',[]);
      commit('set_boundary_check_or_not',true);
      window.initGraph();

    },

    search1: async({commit,state},data)=>{
      var res1 =await entitySearchAPI({keyword:data.value});
      if(!res1){
        res1=[];
      }
      for(var i in state.entityList){
        state.entityList[i].searched=(res1.indexOf(state.entityList[i].id)===-1)?false:true;
      }
      var res2 = await relationSearchAPI({keyword:data.value});
      var relationList=relation.state.relationList;
      if(!res2){
        res2=[];
      }
      for(var j in relationList){
        relationList[j].searched=(res2.indexOf(relationList[j].id)===-1)?false:true;
      }

      window.initGraph();



    }

  },

}

export default entity;

