import entity from "./entity";
import relation from "./relation"
import {answerQuestionAPI} from "../../api/question";
const pages={
  state:{
    loading_visible:true,
    answer_module_visible:false,
    answer_text:"",
  },
  mutations:{
    set_loading_visible: function(state,data){
      state.loading_visible=data;
    },
    set_answer_module_visible: function(state,data){
      state.answer_module_visible=data;
    },
    set_answer_text: function(state,data){
      state.answer_text=data;
    }
  },
  actions:{
    start_loading: async ({commit},data)=>{
      commit('set_loading_visible',data);
    },
    answer_question: async({commit},data)=>{
      const answer = await answerQuestionAPI(data);
      commit('set_answer_text',answer);
    },
  },
}
export default pages;
