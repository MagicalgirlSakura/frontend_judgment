<template>
  <div>
    <div class="upload" >
      <div  @click="openUploader">选择文书</div>
<!--      <a href="javascript:;" class="file">-->
<!--        <input name="file" type="file" @change="checkFile($event)" class="GraphUpload" accept=".pdf" autocomplete="off" >选择文件-->
<!--      </a>-->
<!--      <a-button class="uploadButtom" type="primary" @click="submitAddFile" size="small">开始上传</a-button>-->
      <a-modal  v-model="uploader" title="上传文件" @ok="uploadFiles" :ok-text="uploading?'上传中':'上传'"
               :confirm-loading="uploading">
        <a-upload-dragger
          name="file"
          :multiple="true"
          :remove="handleRemove"
          action="http://localhost:8080/api/score/score"
          @change="handleChange">
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox"/>
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
          <p class="ant-upload-hint">可选中一个或多个文件进行上传</p>
        </a-upload-dragger>
      </a-modal>
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
      uploader: false,
      uploading: false,
      fileList:[]
    }
  },
  methods: {
    openUploader() {
      this.uploader = true;
    },

    uploadFiles() {
      if (this.fileList[0].response !== null) {
        console.log(this.fileList[0].response)
        // this.set_files([this.fileList[0].response.content].concat(this.files));
        // this.dataList = this.files.slice((this.currentPage - this.minPage) * this.pageSize, (this.currentPage - this.minPage + 1) * this.pageSize);
        // this.$message.success(`导入数据库成功`);
        // this.uploader = false;
        let reader=new FileReader();
        reader.readAsText(this.fileList[0].response.content);
        reader.onload=function(){
        let file_content=reader.result;
        var obj=JSON.parse(file_content)
        _this.$store.commit('set_EntityList',obj.entities)
        _this.$store.commit('set_RelationList', obj.relations);
        console.log(this.fileList[0].response.$message);
      }
      setTimeout(() => {
        this.uploading = false;
      }, 2000);
      }
    },
    handleChange(info) {
      const status = info.file.status;
      this.fileList = info.fileList;
      console.log(this.fileList)
      console.log(this.fileList.response);
      console.log("调用了一次handleChange");
      if (status === "done") {
        this.$message.success(`${info.file.name} 上传成功.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },

    // checkFile(event){
    //
    //   let file=event.target.files[0];
    //   this.file=file;
    // },
    // submitAddFile(){
    //   let _this=this
    //   if(this.file===null){
    //     alert("未选定上传文件");
    //   }
    //   else if(this.file.size/1024/1024>100){
    //     alert("文件过大，应不大于100MB");
    //   }
    //   else{
    //     // this.file_content=this.file;
    //     // var formData=new FormData(form);
    //     // formData.append("data","fileContent");
    //     let reader=new FileReader();
    //     reader.readAsText(this.file);
    //     reader.onload=function(){
    //       let file_content=reader.result;
    //       var obj=JSON.parse(file_content)
    //       _this.$store.commit('set_EntityList',obj.entities)
    //       _this.$store.commit('set_RelationList', obj.relations);
    //       _this.$store.commit('set_Update_Types', []);
    //       setTimeout(function(){
    //         window.initGraph();
    //       },500);
    //     }
    //
    //   }
    // },

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
