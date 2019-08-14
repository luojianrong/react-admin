import axios from 'axios';

const BASE_URL = process.env.NODE_ENV==='development'?'http://localhost:3000':'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL:BASE_URL,
  timeout:10000
});

axiosInstance.interceptors.response.use(
  (response)=>{
    //响应成功
    const result = response.data;
    if (result.status === 0){
      //登录成功
      return result.data
    } else if (result.status === 1) {
      //登录失败
      return Promise.reject(result.msg);
    }

  },
  (error)=>{
    //响应失败
    console.log("响应失败:"+error);
    Promise.reject("网络错误请刷新试试")
  }
)



export default axiosInstance;
