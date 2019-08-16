import axiosInstance from './ajax';
import jsonp from 'jsonp';


//封装发送登录请求时的请求方法
export const reqLogin =(username,password)=> axiosInstance.post('/login',{username,password});

//封装用户是否登录过的请求
export const reqValidateUser = (id)=> axiosInstance.post('/validate/user',{id})


//封装天气的请求
export const  reqWeather = (cityname) => {

  return new Promise((resolve,reject)=>{
    jsonp(
      `http://api.map.baidu.com/telematics/v3/weather?location=${cityname}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
      {},
      function (err,data) {
        if (err){
          reject(err);
        } else{
          const {weather,dayPictureUrl} = data.results[0].weather_data[0];
          resolve({weather, dayPictureUrl});
        }
      }
    )
  });

}
