<template>
<!--  <a-modal-->
<!--    :visible="answer_module_visible"-->
<!--    title="问答界面"-->
<!--    cancelText="关闭"-->
<!--    okText="提问"-->
<!--    @cancel="cancel"-->
<!--    @ok="ok"-->
<!--  >-->
<!--  <a-input id="questionInput"placeholder="请输入你的问题" value=""></a-input>-->
<!--  </a-modal>-->
  <a-drawer
    class="drawer"
    title="问答界面"
    placement="bottom"
    :closable="false"
    :visible="answer_module_visible"
    @close="onClose"
  >
    <a-input class="questionInput" id="questionInput"placeholder="请输入你的问题" value=""></a-input><a-button class="questionButton" type="primary" @click="question">提问</a-button>
    <br/><br/>
    <PRE id="answerText">回答:{{this.answer_text}}</PRE>

  </a-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import {answerQuestionAPI} from "../../api/question";

export default {
name: "answerModule",
  data(){
    return{
    }
  },
  methods:{
    question(){
      //const answer_text=await answerQuestionAPI(questionInput.value);
      this.$store.dispatch('answer_question',questionInput.value);
      //var answer=document.getElementById("answerText");
      //answer.innerText="回答: "+this.answer_text;
    },
    cancel(){
      this.$store.commit('set_answer_module_visible',false);
    },
    onClose() {
      this.$store.commit('set_answer_module_visible',false);
    },
  },
  computed:{
    ...mapGetters([
      'answer_module_visible',
      'answer_text',
    ])
  }
}
</script>

<style scoped>
.questionInput{
  width:50%;
}
.drawer{
}
</style>
