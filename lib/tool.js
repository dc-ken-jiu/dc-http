/*
 * @Description:
 * @Author: dingxuejin
 * @Date: 2021-02-01 10:17:19
 * @LastEditTime: 2021-02-01 10:24:18
 * @LastEditors: dingxuejin
 */
import axios from "axios";

let instance = axios.create();

//对axios的配置
instance.defaults.timeout = 10000;
instance.defaults.baseURL = "/";

//添加请求拦截器
instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

//添加响应拦截器
instance.interceptors.response.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
