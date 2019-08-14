import axiosInstance from './ajax';


//封装发送登录请求时的请求方法
export const reqLogin =(username,password)=> axiosInstance.post('/login',{username,password});

export const checkLogin = (id)=> axiosInstance.post('/validate/user',{id})
