<template>
<div>
  <a-table :columns="columns" :data-source="tableData" :pagination="pagination">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle">质量属性</span>
    <span slot="score">得分</span>
    <span slot="percent">超过的文书百分比</span>
  </a-table>
  <a-divider />
  <a-card title="质量提升建议">
    <p v-for="advice in scores.objectAdvice">{{advice}}</p>
  </a-card>
  <a-divider />
  <a-card title="错误用法列表">
    <p v-for="example in scores.wrongUsedList">{{example}}</p>
  </a-card>
</div>
</template>

<script>
import { qualityAPI } from '../api/quality';

const qualityEnum = {
  '1':'判决完整性',
  '2':'数字一致性',
  '3':'标点一致性',
  '4':'一致性',
  '5':'准确性',
  '6':'审判流程',
  '7':'被告人信息',
  '8':'法条引用合理性',
  '9':'审判偏离性',
}

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '得分',
    dataIndex:'score',
  },
  {
    title:'超过的文书百分比',
    dataIndex:'percent',
  },
];

const tableData = [];

const pagination =  {
      hideOnSinglePage:true,
    };

export default {
  name:"quality",
  props:['filename'],
  data() {
    return {
      scores:{},
      tableData,
      columns,
      pagination,

    };
  },
  mounted(){
    this.fetchscores()
    
        
    
  },
  methods:{
    fetchscores(){
      qualityAPI(this.filename).then(response=>{
        this.scores=response;
        console.log(this.scores)
        var count=1;
        var sum=59954;
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.inteScore.toFixed(1),percent:((this.scores.level[0]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.numConsiScore.toFixed(1),percent:((this.scores.level[3]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.signConsiScore.toFixed(1),percent:((this.scores.level[2]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.consiScore.toFixed(1),percent:((this.scores.level[1]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.accScore.toFixed(1),percent:((this.scores.level[4]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.trialScore.toFixed(1),percent:((this.scores.level[6]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.criminalScore.toFixed(1),percent:((this.scores.level[5]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.lawScore.toFixed(1),percent:100+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores.judgeScore.toFixed(1),percent:100+'%'})
      })
      
      
    }
  }
};
</script>
