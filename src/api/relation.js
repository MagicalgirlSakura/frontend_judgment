import { axios } from '@/utils/request'
const api={
  relationPre: '/api/coin'
}

export function findAllRelationAPI(data){
  return axios({
    url: `${api.relationPre}/getAssociatedRelations`,
    method:'GET',
    params:{id:data},
  })
}
export function addRelationshipAPI(data){
  return axios({
    url:`${api.relationPre}/addRelationship`,
    method:'POST',
    params:data,
    param:true,
    //headers:{'content-type':'application/json'}
  })
}
export function deleteRelationshipAPI(data){
  return axios({
    url:`${api.relationPre}/delRelationship1`,
    method:'POST',
    params:data,
    param:true,
  })
}
export function relationshipFinalProcessAPI(data){
  return axios({
    url:`${api.relationPre}/relationshipFinalProcess`,
    method:'POST',
    data,
  })
}
export function updateRelationAPI(id,data){
  return axios({
    url:`${api.relationPre}/updateRelationship`,
    method:'POST',
    params:id,
    data,
  })
}
export function relationSearchAPI(data){
  return axios({
    url:`${api.relationPre}/relationSearch`,
    method:'GET',
    params:data,
  })
}
