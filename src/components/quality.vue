<template>
<div>
  <a-table :columns="columns" :data-source="tableData">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle">质量属性</span>
    <span slot="score">得分</span>
    <span slot="percent">超过的文书百分比</span>
  </a-table>
  <a-card title="质量提升建议">
    <p>被告人周康的工作有待补充。</p>
    <p>被告人杨文的工作、户籍信息有待补充。</p>
    <p>检察员到庭情况有待补充。</p>
  </a-card>
</div>
</template>

<script>


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
    dataIndex:'score',
  },
];

const tableData = [
{
  key:'0',
  name:'判决完整性',
  score:100.0,
  percent:'100%',
},
{
  key:'1',
  name:'数字一致性',
  score:87.8,
  percent:'49%',
},
{
  key:'2',
  name:'标点一致性',
  score:100.0,
  percent:'100%',
},
{
  key:'3',
  name:'一致性',
  score:93.9,
  percent:'89%',
},
{
  key:'4',
  name:'准确性',
  score:84.0,
  percent:'91%',
},
{
  key:'5',
  name:'审判流程',
  score:83.0,
  percent:'78%',
},
{
  key:'6',
  name:'被告人信息',
  score:85.0,
  percent:'92%',
},
];

export default {
  name:"quality",
  data() {
    return {
      tableData,
      columns,
    };
  },
};
</script>
