import axiosInstance from './ajax';

export const reqLogin =(username,password)=> axiosInstance.post('/login',{username,password});

