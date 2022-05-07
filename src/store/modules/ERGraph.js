import entity from "./entity";
import relation from "./relation"
const ERGraph={
  state:{
    ERData:[],
  },
  mutations:{
    transformToERData: function(state){
      state.ERData=[];
      var nodes=JSON.parse(JSON.stringify(entity.state.entityList));
      var links=JSON.parse(JSON.stringify(relation.state.relationList));
      for(var i=0;i<nodes.length;i++){
        nodes[i].relation=[];
      }
      for(i=0; i<links.length;i++){
        var link=links[i];
        //nodes[link.source.index].relation=[];
        nodes[link.source.index].relation.push(link);
      }
      for(i=0;i<nodes.length;i++){
        nodes[i].relation=nodes[i].relation.length===0?undefined:nodes[i].relation;
      }
      var types=entity.state.entityTypes;
      for(i=0; i<types.length;i++){
        var attrs=[];
        for(var j=0; j<nodes.length;j++){
          if(nodes[j].type===types[i]){
            var attr_rels=[];
            if(nodes[j].relation){
              for(var k=0; k<nodes[j].relation.length;k++){
                attr_rels.push({key:nodes[j].relation[k].target.name,label:nodes[j].relation[k].relation,nodeId:nodes[j].relation[k].target.type});
              }
            }

            var attr=nodes[j].relation?{key:nodes[j].name,id:nodes[j].id,relation:attr_rels}:{key:nodes[j].name,id:nodes[j].id};
            attrs.push(attr);
          }
        }
        var type_node={id:types[i],label:types[i],attrs:attrs};
        state.ERData.push(type_node);
      }
    }
  },
  actions:{

  },
}
export default ERGraph;
