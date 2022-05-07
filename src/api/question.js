import { axios } from '../utils/request'
const api={
  questionPre: '/api/coin'
}
export function answerQuestionAPI(data){
  return axios({
    url:`${api.questionPre}/question`,
    method:'GET',
    params: {question:data},
  })
}
