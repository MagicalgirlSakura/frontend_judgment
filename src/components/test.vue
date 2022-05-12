<template>
  <div class="test">
    <div class="fuhan">
    <h1>裁判文书质量展示</h1>
    </div>
    <div>
      <answerModule></answerModule>
      <modify-entity-moduel v-bind:cur_node="selected_node"></modify-entity-moduel>
      <modify-relation-moduel v-bind:cur_relation="selected_link"></modify-relation-moduel>
      <add-node-moduel></add-node-moduel>
      <add-relation-moduel></add-relation-moduel>
      <div ref="out">
        <functionMenu id="sliderContainer" @kssstart="kssstart" @downloadJson="downloadJson" @refresh="refresh" @showQuality="test1"></functionMenu>
        <a-spin id="svgContainer" tip="loading..."  :spinning="loading_visible" :delay="400">
          <div id="svgContainer1" ref="svgContainer">
            <svg id="svg1"></svg>
          </div>
        </a-spin>
        </div>
      <qualityshow ref="qualityShow"/>
    </div>
  </div>
</template>


<script>

import * as d3 from 'd3';
import { mapGetters, mapActions, mapMutations } from 'vuex'
import html2canvas from 'html2canvas';
import modifyEntityModuel from "./modify_modules/modifyEntityModuel";
import modifyRelationModuel from "./modify_modules/modifyRelationModuel";
import addNodeModuel from "./modify_modules/addNodeModuel";
import addRelationModuel from "./modify_modules/addRelationModuel";
import functionMenu from "./modify_modules/functionMenu.vue";
import answerModule from "./modify_modules/answerModule.vue";
import qualityshow from '../components/qualityshow.vue'
import $ from 'jquery';



export default {
  name: 'test',
  components: {
    answerModule,
    modifyEntityModuel,
    addRelationModuel,
    addNodeModuel,
    modifyRelationModuel,
    functionMenu,
    qualityshow
  },
  data () {
    return {
        "width": 0,
        "height": 0,
        "simulation":{},
        "chargeStrength": -300,//引力
        "collide": -10,        //碰撞检测（间距）
        "alphaDecay":0.0228,  //力学模拟衰减率
        "selected_node":-1,
        "selected_link":-1,
        "svg":"",
        "g":"",
        showQuality: false,
    };
  },
  async beforeMount(){
    this.width=window.innerWidth*0.9;
    this.height=window.innerHeight*1;
  },
  async mounted(){
    var _this=this;
    window.initGraph=this.initGraph;
    window.getTypes=this.getTypes;
    window.addNode=this.addNode;
    window.addRelation=this.addRelation;
    window.kssstart=this.kssstart;
    window.downloadJson=this.downloadJson;
    this.$store.commit('set_type_setting_mode',false);
    this.$store.dispatch('getAllEntityList','60c4bf65c319222ab4072986');
      if(this.enableUpdate){window.setInterval(() => {
        setTimeout(function(){
          _this.updateRecord();
        }, 0);
      }, 3000);
      }
  },

  methods: {
    test1 () {
      this.$refs.qualityShow.showComponent()
    },
    refresh() {
      this.svg.call(this.zoom.transform, d3.zoomIdentity)
    },

    updateRecord(){
      this.$store.dispatch('updateLocation',this.nodes);
    },
    downloadJson(){
      var nodes=JSON.parse(JSON.stringify(this.nodes));
      var links=JSON.parse(JSON.stringify(this.links));
      let i=0;
      for(i=0; i<links.length;i++){
        links[i].source=links[i].source.id;
        links[i].target=links[i].target.id;
      }
      let obj={entities:nodes,relations:links};
      let data = JSON.stringify(obj, undefined, 4);
      var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
      a.download = "out.json"
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e);
    },
    kssstart () {
      let canvasID = this.$refs.svgContainer;
      let that = this;
      let a = document.createElement('a');
      html2canvas(canvasID, {useCORS:true, scrollY:0,removeContainer:false}).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.displayay = "none";
        a.style.display = "none";
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
        a.setAttribute("href", URL.createObjectURL(blob));
        a.setAttribute("download", "res.png")
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
      });
    },
    dataURLToBlob(dataurl) {//ie 图片转格式
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: mime})
    },
    nodesInitial(){
      for(var i in this.nodes){
        if (isNaN(this.nodes[i].x)){
          this.nodes[i].x=this.width/2;
        }
        if(isNaN(this.nodes[i].y)){
          this.nodes[i].y=this.height/2;
        }
      }
    },
    zoomed(){
      d3.select("#g_container").attr('transform',d3.event.transform);
    },
    initForce(){
      var _this=this;
      console.log(_this.nodes);
      if(!this.force_or_not){this.$store.commit('set_lock_all_nodes');}
      this.getTypes();
      //基于nodes与link数据初始化图谱

      var marge = {top:0,bottom:0,left:0,right:0}
      var svg=d3.select("#svg1").attr("viewBox", [0, 0, this.width, this.height]);
      var svg_g=svg.attr("preserveAspectRatio", "xMidYMid meet")
          .append("g");
      var g = svg_g.append("g")
        .attr("transform","translate("+marge.top+","+marge.left+")")
        .attr("id", "g_container");
      this.svg=svg;
      this.g=g;
      _this.zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', _this.zoomed)
      _this.svg.call(_this.zoom);
      //力学模拟器
      var simulation=d3.forceSimulation(_this.nodes);
      this.simulation=simulation;
      simulation.force("charge", d3.forceManyBody().strength(_this.chargeStrength))
        .force("center", d3.forceCenter(_this.width/2,_this.height/2+50))
        //.force("collide", d3.forceCollide(_this.collide).strength(_this.collide))
        .on("tick", ticked);
      simulation.force("link",d3.forceLink(_this.links).distance(_this.entity_distance).id(function(d){
        return d.id;
      }));
      /*window.setTimeout(function(){
        _this.simulation.stop();
      },1000);*/

      //颜色比例尺
      var colorScale=d3.scaleOrdinal()
        .domain(d3.range(_this.entity_types))
        .range(d3.schemeCategory10);


      this.drawMarker();
      //画边
      var edges=g.append("g")
        .selectAll("path")
        .data(_this.links)
        .enter()
        .append("path")
        .attr("stroke","black")
        .attr("stroke-width", d=>{return d.searched?3:2})
        .attr("stroke-dasharray", function(d){
          if(d.relation==="default"){
            return 5;
          }else return 0;
        })
        .attr("linkId", function(d){
          return d.index;
        })
        //.attr("d", d=>"M "+d.source.x+" "+d.source.y+" L "+d.target.x+" "+d.target.y)
        .attr("marker-end","url(#arrow)")
        .on('click', this.modifyLink)
        .attr('opacity', d=>{return d.searched?1:0.5})

      //在边上添加文字描述
      var linksText=g.append("g")
        .selectAll("text")
        .data(_this.links)
        .enter()
        .append("text")
        .attr("stroke", "red")
        .attr("stroke-width",d=>{return d.searched?1:0})
        .attr("font-size", this.link_text_font_size)
        .text(function(d){
          if(d.relation!=="default"&&_this.link_text_visible){
            return d.relation;
          }
          else return "";
        })
        .attr("opacity",d=>{return d.searched?1:0.8});


      //给每个节点添加分组
      var gs=g.selectAll(".circleText")
        .data(_this.nodes)
        .enter()
        .append("g")

      $('gs').on('click',this.modifyNode);
      //在gs上画圈圈和文字，组合成节点
      var circles=gs.append("circle")
        .attr("class", "circle")
        .attr("r", _this.r_circle)
        .attr("nodeId", function (d){
          return d.index;
        })
        .attr("name", function(d){
          return d.name;
        })
        .attr("fill", function(d,i){
          var type=_this.nodes[i].type;
          var index;
          for(index=0; index<_this.entity_types.length;index++){
            if(type===_this.entity_types[index]){
              break;
            }
          }
          return colorScale(index);
        }
        )
        .attr("stroke", d=>{return d.searched?"yellow":"black"})
        .attr("stroke-width", d=>{return d.searched?5:1})
        .attr("opacity", function(d){
          if(d.selected){
            return 1;
          }else{
            return 0.4;
          }
        })
        .call(d3.drag()
          .on('start',function(d) {
            if (!event.active) _this.simulation.alphaTarget(0.1).restart()
            if(!_this.fixed){
              d.fx=null;
              d.fy=null;
            }
          })
          .on('drag',function(d){
            if(_this.fixed){
              d.fx=event.offsetX;
              d.fy=event.offsetY;
            }else{
              d.x=event.offsetX;
              d.y=event.offsetY;
            }
          })
          .on('end', function(d){
            if (!event.active) _this.simulation.alphaTarget(0);

          })
        );
      $('circle').on('click', this.modifyNode);
      //节点中的文本
      gs.append("text")
        .attr("y", 5)
        .attr('text-anchor', 'middle')
        //.attr('margin-top', this.r_circle/2)
        .text(function(d){
          if(d.name!==""){
            return d.name;
          }
          else{
            if(d.type==='AnimeCharacter'){
              return d.properties.otherNames;
            }
            if(d.type==='Anime'){
              return d.properties.japaneseName;
            }
            if(d.type==='AnimeCompany'){
              return d.properties.otherNames;
            }

          }
        })
        .attr('nodeId', function(d){
          return d.index;
        })
        .attr("stroke", "yellow")
        .attr("stroke-width", d=>{return d.searched?1:0})
        .attr('font-size', function(){return _this.entity_text_font_size})
        .attr("opacity", function(d,i){
          if(d.selected){
            return 1;
          }else{
            return 0.4;
          }
        });
      $('text').on('click', this.modifyNode);
      //tick函数，周期性调用以更新边、节点等的位置。
      function ticked(){
        console.log(this.boundary_check_or_not);
        _this.nodesInitial();
        linksText
          .attr("x",function(d){
            return (d.source.x+d.target.x)/2;
          })
          .attr("y",function(d){
            return (d.source.y+d.target.y)/2-5;
          })


        gs.attr("transform",function(d) {
          //更新节点位置，并且防止它们飞出画布
          if(_this.boundary_check_or_not){
            console.log(1);
            nodeBoundaryCheck(d);
          }
          return "translate(" + d.x + ","+d.y+")";}
        );
        edges
          .attr('d', function(d){
            var x1=d.source.x, y1=d.source.y, x2=d.target.x, y2=d.target.y;
            var radius=_this.r_circle;
            var c=Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2, 2));
            var tar_x1=x1+(radius/c)*(x2-x1);
            var tar_y1=y1+(radius/c)*(y2-y1);
            var tar_x2=x2-(radius/c)*(x2-x1);
            var tar_y2=y2-(radius/c)*(y2-y1);
            return "M "+tar_x1+" "+tar_y1+" L "+tar_x2+" "+tar_y2
          })
      }

      function nodeBoundaryCheck(d){
        //防止节点和边飞出画布边界
        if(d.x<_this.r_circle+10){ d.x=_this.r_circle+10;}
        if(d.x>=_this.width-_this.r_circle-10){d.x=_this.width-_this.r_circle-10;}
        if(d.y<_this.r_circle+10){ d.y=_this.r_circle+10;}
        if(d.y>=_this.height-_this.r_circle-10){d.y=_this.height-_this.r_circle-10;}
      }
      },
    drawMarker(){
      //画箭头
      //let refx=this.r_circle/2+7.5;
      let refx=7.5;
      var arrowMarker = d3.select("#svg1").append("marker")
        .attr("id","arrow")
        .attr("markerUnits","strokeWidth")
        .attr("markerWidth","100")
        .attr("markerHeight","100")
        .attr("refX",refx)
        .attr("refY","4")
        .attr("orient","auto");
      let arrow_x=0;
      let arrow_y=0;
      var arr_path="M "+arrow_x+","+arrow_y+" L "+(arrow_x+8)+","+(arrow_y+4)+" L "+(arrow_x)+","+(arrow_y+8)+" L "+
        (arrow_x+4)+","+(arrow_y+4)+" L "+(arrow_x)+","+(arrow_y);
      arrowMarker.append("path")
        .attr("d",arr_path)
        .attr("fill","#000");
    },
    getTypes(){
      let arr=this.$store.getters.entity_types;
      let i=0;
      for(i=0; i<this.nodes.length;i++){
        if(arr.indexOf(this.nodes[i].type)===-1){
          arr.push(this.nodes[i].type);
        }
      }
      this.$store.commit('set_Update_Types', arr);
    },
    initGraph(){
      //将原先的图谱视图全部删除。
      var svg=d3.select("#svg1");
      svg.selectAll("*").remove();
      //重新画图
      this.initForce();
    },
    modifyNode(){
      this.selected_node=event.srcElement.attributes.nodeId.value;
      this.$store.commit('set_current_node', this.selected_node);
      this.$store.commit('set_Modify_Node_Visible', true);
    },
    modifyLink(d){
      this.selected_link=event.srcElement.attributes.linkId.value;
      this.$store.commit('set_Modify_Relation_Visible', true);
    },
    addNode(){
      this.$store.commit('set_Add_Node_Visible', true);
    },
    addRelation(){
      this.$store.commit('set_Add_Relation_Visible', true);
    },
  },
  computed:{
    ...mapGetters([
      'loading_visible',
      'force_or_not',
      'entity_text_font_size',
      'type_setting_mode',
      'enableUpdate',
      'fixed',
      'nodes',
      'links',
      'entity_types',
      'entity_distance',
      'link_text_font_size',
      'link_text_visible',
      'r_circle',
      'boundary_check_or_not',
    ]),

  },


}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fuhan{
  background-color: rgb(30,144,255);
}
h1, h2 {
  color:white;
  font-weight: 700;
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#svgContainer{
  flex:0 1 80%;
  display:block;
  max-width:80%;
  width:80%;
  float: left;
  border:3px solid rgb(30,144,255);

}
#sliderContainer{
  flex:0 0 20%;
  display:block;
  max-width:20%;
  width:20%;
  float:left;
}
#svg1{
  width:100%;
  height:100%;
}
</style>
