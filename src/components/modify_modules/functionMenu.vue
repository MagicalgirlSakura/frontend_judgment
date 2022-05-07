<template>
      <div id="components-slider-demo-mark">
        <a-dropdown v-if="show">
          <!-- <a-input-search id="search" v-model="inputContent" placeholder="input search text" enter-button @search="onSearch" /> -->
          <a-menu slot="overlay">
            <a-menu-item>
              <a-row>
                <!-- <a-col :span="12"><a-button type="danger" style="float:right;margin-right:20px" @click="deleteHistory">删除历史记录</a-button></a-col> -->
              </a-row>
            </a-menu-item>
            <a-menu-item v-for="item in searchHistory" :key="item" @click="insertIntoSearch">
              <a href="javascript:;">{{ item }}</a>
            </a-menu-item>

          </a-menu>
        </a-dropdown>
        <a-menu
          id="menu"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
          mode="inline"
          theme="light"

        >
          <a-sub-menu>
            <span slot="title"><span style="float:left">上传文书</span></span>
            <a-menu-item>
              <fileUpload></fileUpload>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu v-if="show">
            <span slot="title"><span style="float:left">显示设置</span></span>
            <a-menu-item>
              <div>
                <a-button @click="refresh" style="float:left" >缩放复位</a-button>
              </div>
            </a-menu-item>
            <a-menu-item>
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp拖拽后固定节点&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="12">
                  <a-switch default-unchecked @change="dragOnChange" style="marginLeft:40px"/>
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item>
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp锁定布局&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="10">
                  <a-switch default-unchecked @change="forceOrFixed" style="marginLeft:20px"/>
                </a-col>
                <a-col :span="4">
                  <h4>&nbsp力导模式</h4>
                </a-col>
              </a-row>
            </a-menu-item>
          </a-sub-menu >
          <a-sub-menu >
            <span slot="title"><span style="float:left">调节展示效果</span></span>
            <a-menu-item v-if="show">
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp节点大小&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="10">
                  <a-slider v-model="radius" @change="radiusChanged" :min="10" :max="80" />
                </a-col>
                <a-col :span="4">
                  <a-input-number v-model="radius" @change="radiusChanged" :min="10" :max="80" style="marginLeft: 5px" />
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item v-if="show">
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp节点距离&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="10">
                  <a-slider v-model="distance" @change="distanceChanged" :min="50" :max="500" />
                </a-col>
                <a-col :span="4">
                  <a-input-number v-model="distance" @change="distanceChanged" :min="50" :max="500" style="marginLeft: 5px" />
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item v-if="show">
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp关系文字大小&nbsp</h4>
                </a-col>
                <a-col :span="5">
                </a-col>
                <a-col :span="10" left-margin="100px">
                  <a-slider v-model="font_size" @change="textSizeChanged" :min="10" :max="30" />
                </a-col>
                <a-col :span="4">
                  <a-input-number v-model="font_size" @change="textSizeChanged" :min="10" :max="30" style="width:60px; marginLeft: 5px" />
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item v-if="show">
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp节点文字大小&nbsp</h4>
                </a-col>
                <a-col :span="5">
                </a-col>
                <a-col :span="10">
                  <a-slider v-model="font_size_entity" @change="entityTextSizeChanged" :min="10" :max="30" />
                </a-col>
                <a-col :span="4">
                  <a-input-number v-model="font_size_entity" @change="entityTextSizeChanged" :min="10" :max="30" style=" width:60px;marginLeft: 5px" />
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item v-if="show">
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp显示关系标签&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="14">
                  <a-switch default-checked @change="labelOnChange" style="marginLeft:40px"/>
                </a-col>
              </a-row>
            </a-menu-item>
            <!-- <a-menu-item>
              <a-row>
                <a-col :span="4">
                  <h4>&nbsp排版模式&nbsp</h4>
                </a-col>
                <a-col :span="2">
                </a-col>
                <a-col :span="14">
                  <a-switch v-if="show" default-unchecked @change="modeOnChange" style="marginLeft:40px"/>
                  <a-switch v-if="type_setting_mode" default-checked @change="modeOnChange" style="marginLeft:40px"/>
                </a-col>
              </a-row>
            </a-menu-item> -->

          </a-sub-menu>

          <a-menu-item @click="updateLocation">
            <a-row>
              <a-col :span="4">
                <h4>保存布局</h4>
              </a-col>
              <a-col :span="16"></a-col>
            </a-row>
          </a-menu-item>
          <!-- <a-menu-item @click="answer">
            <a-row>
              <a-col :span="4">
                <h4>智能问答</h4>
              </a-col>
              <a-col :span="16"></a-col>
            </a-row>
          </a-menu-item> -->
          <a-sub-menu >
            <span slot="title"><span style="float:left">导出数据</span></span>
            <a-menu-item @click="handleExportImg">
              <a-row>
                <a-col :span="4">
                  <h4>导出图片</h4>
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item @click="handleExportJSON">
              <a-row>
                <a-col :span="4">
                  <h4>导出JSON</h4>
                </a-col>
              </a-row>
            </a-menu-item>
          </a-sub-menu>
          <!-- <a-sub-menu v-if="show">
            <span slot="title"><span style="float:left">添加图元</span></span>
            <a-menu-item @click="handleAddEntity">
              <a-row>
                <a-col :span="4">
                  <h4>添加节点</h4>
                </a-col>
              </a-row>
            </a-menu-item>
            <a-menu-item @click="handleAddRelation">
              <a-row>
                <a-col :span="4">
                  <h4>添加关系</h4>
                </a-col>
              </a-row>
            </a-menu-item>
          </a-sub-menu> -->
          <a-menu-item @click="qualityshow">
            <a-row>
              <a-col :span="4">
                <h4>质量评估</h4>
              </a-col>
              <a-col :span="16"></a-col>
            </a-row>
          </a-menu-item>
          <!--类型过滤-->
          <MultiSelector v-if="show"></MultiSelector>


        <!-- <a-button @click="fuckaaa()">aaa</a-button> -->
        </a-menu>
        <!-- <a-card title="图谱统计" style="width: auto">
          <PRE align="left">{{ load_compelete?get_statistical_result:"" }}</PRE>
        </a-card> -->
      </div>

</template>
<script>
import MultiSelector from "./MultiSelector";
import fileUpload from "./fileUpload";
import {mapGetters} from "vuex";
export default {
  computed:{

    ...mapGetters(['get_statistical_result','load_compelete','nodes','type_setting_mode']),
    show(){
      return (!this.type_setting_mode);
    },
  },
  components:{
    MultiSelector,
    fileUpload,
  },
  data() {
    return {
      inputContent:"",  //搜索框内容
      searchHistory:[], //搜索记录历史
      radius: 40,
      font_size: 18,
      font_size_entity:18,
      distance: 200,
      obscureSearch:false,
    };
  },
  created(){

    var history=window.localStorage.getItem("searchHistory");
    this.searchHistory=history?history.split(","):[];
  },
  methods: {
    refresh(){
      //缩放复位
      this.$emit('refresh');
    },
    forceOrFixed(checked){
      if(!checked){
        this.$store.commit('set_lock_all_nodes');
      }else{
        this.$store.commit('set_unlock_all_nodes');
      }
    },
    deleteHistory(){
      this.searchHistory=[];
      window.localStorage.setItem('searchHistory', this.searchHistory);
    },
    insertIntoSearch(value){
      this.inputContent=value.key;
    },
    onSearch(value) {
      if(this.searchHistory.indexOf(value)===-1){
        this.searchHistory.unshift(value);
      }else{
        this.searchHistory.splice(this.searchHistory.indexOf(value), 1);
        this.searchHistory.unshift(value);
      }
      if(this.searchHistory.length>10){
        this.searchHistory.pop();
      }
      window.localStorage.setItem("searchHistory",this.searchHistory);
      this.$store.dispatch('search',{value:this.inputContent,mode:this.obscureSearch});
    },
    obscureSearchMode(checked){
      this.obscureSearch=checked;
    },
    updateLocation(){
      this.$store.dispatch('saveLocation', this.$parent.nodes);
    },
    handleExportImg(){
      this.$emit("kssstart");
    },
    handleAddEntity(){
      this.$store.commit('set_Add_Node_Visible', true);
    },
    handleAddRelation(){
      this.$store.commit('set_Add_Relation_Visible', true);
    },
    handleExportJSON(){
      this.$emit("downloadJson");
    },
    entityTextSizeChanged(){
      this.$store.commit('set_entity_text_font_size', this.font_size_entity);
    },
    textSizeChanged(){
      this.$store.commit('set_link_text_font_size',this.font_size);
    },
    radiusChanged(){
      this.$store.commit('set_entity_radius',this.radius);
    },
    distanceChanged(){
      this.$store.commit('set_entity_distance',this.distance);
    },
    labelOnChange(checked){
      this.$store.commit('set_link_text_visible',checked);
    },
    modeOnChange(checked){
      this.$store.commit('set_type_setting_mode',checked);
      this.$store.commit('transformToERData');
      if(checked){
        this.$router.push('ERGraph');
      }
      else{
        this.$router.push('/');
      }
    },
    dragOnChange(checked){
      this.$store.commit('set_drag_fixed',checked);
    },
    answer(){
      this.$store.commit('set_answer_module_visible',true);
    },
    qualityshow() {
      // this.$router.push("/qualityshow");
      this.$emit('showQuality')
    }
  },

};
</script>
<style scoped>
/* #components-slider-demo-mark{
} */
#menu{
  border-top:4px solid #F0F8FF;
  /*border-right:2px solid #F0F8FF;*/
  border-bottom:4px solid #F0F8FF;

}
.ant-menu-item{
  border-top:1px solid #F0F8FF;
  border-bottom:1px solid #F0F8FF;
}
</style>
