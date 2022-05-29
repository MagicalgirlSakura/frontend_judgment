import { axios } from '../utils/request'
const api={
  entityPre: '/api/coin'
}
export function findAllEntityAPI(data){
  return axios({

    url: `${api.entityPre}/getAssociatedEntities`,
    method:'GET',
    params:{id:data},
  })
}
export function addEntityAPI(data){
  return axios({
    url: `${api.entityPre}/addEntity`,
    method:'POST',
    data,

  })
}
export function modifyEntityAPI(data){
  return axios({
    url:`${api.entityPre}/updateEntity`,
    method:'POST',
    params:data,
    param:true,
  })
}
export function deleteEntityAPI(data){
  return axios({
    url:`${api.entityPre}/deleteEntity`,
    method:'POST',
    params:data,
    param:true,
  })
}
export function eneityFinalProcessAPI(data){
  return axios({
    url:`${api.entityPre}/entityFinalProcess`,
    method:'POST',
    data,
  })
}
export function updateLocationAPI(data){
  return axios({
    url:`${api.entityPre}/updateAllLocation`,
    method:'POST',
    data,
  })
}
export function updateEntityAPI(data){
  return axios({
    url:`${api.entityPre}/updateEntity`,
    method:'POST',
    data,
    params:{id:data.id},
  })
}
export function entitySearchAPI(data){
  return axios({
    url:`${api.entityPre}/searchByName`,
    method:'GET',
    params:{name:data},
  })
}

export function getGraphDataAPI(data){
  return axios({
    url:`/api/graph/getGraph`,
    method:'GET',
    params:{fileName:data},
  })
}
