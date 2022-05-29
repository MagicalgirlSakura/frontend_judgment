import Vue from 'vue'
import axios from 'axios'
import { VueAxios } from './axios'
import {notification, message} from 'ant-design-vue'
import store from '@/store'
import * as Message from "autoprefixer";
import process from "process";

//const service = axios.create({
//  baseURL: process.env.NODE_ENV === 'production' ? '...': 'http://localhost:8080',
//  withCredentials: true
//})
//创建axios实例
const service = axios.create({
  baseURL:process.env.NODE_ENV === 'production'?'http://http://111.229.244.48/8088':'http://localhost:8080',
  // baseURL:'http://111.229.244.48:8088',
  //withCredentials: true,
  //baseURL:'http://localhost:8088',
  timeout: 30*1000,
})
//request interceptor
service.interceptors.request.use(config=>{
  /*if(!config.param){
  }*/
  config.data=JSON.stringify(config.data);
  if(config.param){
    config.headers={
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }
  else{
    config.headers={
      'Content-Type':'application/json'
    }
  }
  return config;
},error=>{
  Promise.reject(error);
})

service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  // if(response.status===200){
  //   if(response.data.success){
  //     if(response.data.content!=null){
        return response.data.content;
  //     }else{
  //       return "success";
  //     }
  //   }
  //   message.error(response.data.message)
  // }
 }, error => {
//   /***** 接收到异常响应的处理开始 *****/
//   if (error && error.response) {
//     // 1.公共错误处理
//     // 2.根据响应码具体处理
//     switch (error.response.status) {
//       case 400:
//         message.error('错误请求');
//         break;
//       case 401:
//         message.error('未授权，请重新登录')
//         break;
//       case 403:
//         message.error('拒绝访问')
//         break;
//       case 404:
//         message.error('请求错误,未找到该资源')
//         //window.location.href = "/NotFound"
//         break;
//       case 405:
//         message.error('请求方法未允许')
//         break;
//       case 408:
//         message.error('请求超时')
//         break;
//       case 500:
//         message.error('服务器端出错')
//         break;
//       case 501:
//         message.error('网络未实现')
//         break;
//       case 502:
//         message.error('网络错误')
//         break;
//       case 503:
//         message.error('服务不可用')
//         break;
//       case 504:
//         message.error('网络超时')
//         break;
//       case 505:
//         message.error('http版本不支持该请求')
//         break;
//       default:
//         message.error(`连接错误${error.response.status}`)
//     }
//   } else {
//     // 超时处理
//     if (JSON.stringify(error).includes('timeout')) {
//       message.error('服务器响应超时，请刷新当前页')
//     }
//     error.message('连接服务器失败')
//   }

    message.error(error.message);

//   /***** 处理结束 *****/
    return Promise.resolve(error.response)
// })
})

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}
export {
  installer as VueAxios,
  service as axios
}
