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
    <p v-for="advice in scores[0].objectAdvice">{{advice}}</p>
  </a-card>
  <a-divider />
  <a-card title="错误用法列表">
    <p v-for="example in scores[0].wrongUsedList">{{example}}</p>
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
      scores:[],
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
        this.scores.push(response);
        console.log(this.scores)
        var count=1;
        var sum=59954;
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].inteScore.toFixed(1),percent:((this.scores[0].level[0]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].numConsiScore.toFixed(1),percent:((this.scores[0].level[3]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].signConsiScore.toFixed(1),percent:((this.scores[0].level[2]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].consiScore.toFixed(1),percent:((this.scores[0].level[1]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].accScore.toFixed(1),percent:((this.scores[0].level[4]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].trialScore.toFixed(1),percent:((this.scores[0].level[6]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].criminalScore.toFixed(1),percent:((this.scores[0].level[5]/sum*100).toFixed(1))+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].lawScore.toFixed(1),percent:100+'%'})
        this.tableData.push({key:count,name:qualityEnum[count++],score:this.scores[0].judgeScore.toFixed(1),percent:100+'%'})
      })
      
      
    }
  }
};
</script>
