<template>
  <div>
    <div class="upload">
      <a href="javascript:;" class="file">
        <input name="file" type="file" @change="checkFile($event)" class="GraphUpload" accept=".pdf" autocomplete="off" >选择文件
      </a>
      <a-button class="uploadButtom" type="primary" @click="submitAddFile" size="small">开始上传</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "fileUpload",
  data(){
    return{
      "file": null,
      "file_content": "",
      obj:{},
    }
  },
  methods: {
    checkFile(event){

      let file=event.target.files[0];
      this.file=file;
    },
    submitAddFile(){
      let _this=this
      if(this.file===null){
        alert("未选定上传文件");
      }
      else if(this.file.size/1024/1024>100){
        alert("文件过大，应不大于100MB");
      }
      else{
        let reader=new FileReader();
        reader.readAsText(this.file);
        reader.onload=function(){
          let file_content=reader.result;
          var obj=JSON.parse(file_content)
          _this.$store.commit('set_EntityList',obj.entities)
          _this.$store.commit('set_RelationList', obj.relations);
          _this.$store.commit('set_Update_Types', []);
          setTimeout(function(){
            window.initGraph();
          },500);
        }

      }
    },

  }
}

</script>

<style scoped>
.upload{
  margin-left:-100px;
}
.file {
  position: relative;
  margin-top:5px;
  display: inline-block;
  background: #D0EEFF;
  border: 1px solid #99D3F5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1E88C7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  font-size:16px;
}
.file input {
  font-size:16px;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
}

.file:hover {
  background: #AADFFD;
  border-color: #78C3F3;
  color: #004974;
  text-decoration: none;
}
.uploadButtom{
  margin-top:5px;
  font-size:16px;
  width:90px;
  position: absolute;
  margin-left:10px;
  height:30px;
  line-height: 20px;
  display: inline-block;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  text-decoration: none;
  text-indent: 0;
  background: #D0EEFF;
  border: 1px solid #99D3F5;
  color: #1E88C7;
}
.uploadButtom:hover {
  background: #AADFFD;
  border-color: #78C3F3;
  color: #004974;
  text-decoration: none;
}
</style>
