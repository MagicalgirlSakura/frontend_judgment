import { axios } from '../utils/request'
const api={
  questionPre: '/api/score'
}
export function qualityAPI(data){
  return axios({
    url:`${api.questionPre}/score`,
    method:'GET',
    params: {fileName:data},
  })
}