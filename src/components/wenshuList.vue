<template>
  <div>
    <a-table :columns="columns" :data-source="tableData" >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle">文书名</span>

      <span slot="action" slot-scope="text,record">
      <a-button @click="show(record)">质量评估</a-button>
      <a-button @click="showGraph(record)">加入图谱</a-button>
      </span>
    </a-table>
    <a-modal v-model="showquality">
      <quality v-if="showquality" :filename="linename"></quality>
    </a-modal>
  </div>
</template>
<script>

import quality from '../components/quality.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'xuhao',
    key: 'xuhao',
  },
  {
    dataIndex: 'name',
    key: 'name',
    slots: {title: 'customTitle'},
    scopedSlots: {customRender: 'name'},
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
  },
];

const tableData = [];

export default {
  name: "wenshuList",
  props: ['fileList'],
  data() {
    return {
      tableData,
      columns,
      showquality: false,
      linename:'',
    };
  },
  methods: {
    show(record) {
      this.linename=record.name;
      this.showquality = true;
      
    },
    showGraph(record) {

      this.$store.dispatch('showGraph',record.name);
      //console.log(record)
      //console.log(record.name)
      
    },


  },
  mounted() {
    var count = 1;
    if (this.fileList) {
      for (var i = 0; i < this.fileList.length; i++) {
        this.tableData.push({key: count, xuhao: count, name: this.fileList[i].response.content});
        count += 1;
      }
    }
    
  },
  components: {quality}
};
</script>

