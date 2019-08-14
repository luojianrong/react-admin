
/*封装axios的请求*/
import axios from 'axios';

//process.env.NODE_ENV：可以获取当前是开发环境（development）还是生产环境（production）
const BASE_URL = process.env.NODE_ENV==='development'?'http://localhost:3000':'http://localhost:5000';

//创建axios实例
const axiosInstance = axios.create({
  baseURL:BASE_URL,  //请求的基本路径
  timeout:10000  //请求的响应时间，超过则响应响应的错误信息
});

//设置拦截器/中间件
axiosInstance.interceptors.response.use(
  (response)=>{
    //响应成功
    //处理响应的数据
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
