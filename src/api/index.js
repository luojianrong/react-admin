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

//封装分类展示的请求
export const getCategory = (parentId) => axiosInstance.get(`/manage/category/list`,{
  params:{
    parentId
  }
});

//封装添加分类的请求
export const addCategoryFrom = (categoryName,parentId) => axiosInstance.post('/manage/category/add',{categoryName,parentId});

//封装修改分类名称的请求
export const updateCategoryNameFrom = (categoryId,categoryName) => axiosInstance.post('/manage/category/update',{categoryId,categoryName});

//封装获取产品列表的请求
export const reqProducts = (pageNum, pageSize) => axiosInstance.get('/manage/product/list', {
  params: {
    pageNum,
    pageSize
  }
})

//添加产品请求
export const addProduct = ({ name, desc, price, detail, categoryId, pCategoryId })=> axiosInstance.post('/manage/product/add',{ name, desc, price, detail, categoryId, pCategoryId })

//搜索产品的请求
export const reqSearch = (options) =>axiosInstance.get('/manage/product/search', { params: options })


//获取角色列表请求
export  const  reqRoles =() => axiosInstance.get('/manage/role/list');

//创建角色的请求
export const reqAddRole = (name) => axiosInstance.post("/manage/role/add",{name});

//更新角色的请求
export const reqUpdateRole = (_id, auth_name, menus) => axiosInstance.post("/manage/role/update",{_id, auth_name, menus});


//获取用户列表的请求
export  const reqGetUser = () => axiosInstance.get("/manage/user/list");

//创建用户的请求
export const  reqAddUser = ({username,password,phone,email,role_id}) => axiosInstance.post("/manage/user/add",{username,password,phone,email,role_id});

//删除用户请求
export const reqRemoveUser = (userId) => axiosInstance.post("manage/user/delete",{userId})
