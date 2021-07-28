/*
 * @Description:
 * @Author: dingxuejin
 * @Date: 2021-02-01 10:17:19
 * @LastEditTime: 2021-07-28 18:39:59
 * @LastEditors: Please set LastEditors
 */
import axios from 'axios';
import qs from 'qs';

class DCHttp {
    constructor(config) {
        //请求拦截器
        this.interceptorsRequest = "";
        //响应拦截器
        this.interceptorsResponse = "";
        //响应策略
        this.strategy = "";
        //初始化
        this.init(config);
    }
    /**
     * 初始化,处理config参数,创建axios实例
     */
    init(config) {
        this.handStrategy(config);
        this.config = this.handleConfig(config);
        this.axios = this.addInterceptors();
    }
    /**
     * 
     * 处理策略值
     */
    handStrategy(config) {
        if (typeof config.strategy == "function") {
            this.strategy = config.strategy;
        } else {
            this.strategy = async function (p) {
                return p
            }
        }
    }
    /**
     * 处理config参数
     */
    handleConfig(config) {
        //处理拦截器
        let { interceptorsRequest, interceptorsResponse } = config;

        let interceptor = { interceptorsRequest, interceptorsResponse };

        Object.keys(interceptor).map((key) => {
            let item = config[key];
            if (item) {
                if (!("success" in item)) {
                    item["success"] = function (config) {
                        // 在发送请求之前做些什么
                        return config;
                    }
                }

                if (!("error" in item)) {
                    item["error"] = function (error) {
                        // 对请求错误做些什么
                        return Promise.reject(error);
                    }
                }

                delete config[key]
            }
        })

        this.interceptorsRequest = interceptorsRequest || "";
        this.interceptorsResponse = interceptorsResponse || "";

        return config;
    }
    /**
     * 
     * 增加拦截器
     */
    addInterceptors() {
        const instance = axios.create(this.config);

        if (this.interceptorsRequest) {
            let { success, error } = this.interceptorsRequest;
            instance.interceptors.request.use(success, error);
        }
        if (this.interceptorsResponse) {
            let { success, error } = this.interceptorsResponse;
            instance.interceptors.response.use(success, error);
        }

        return instance;
    }
    baseRequest(type, url, value = "", config = {}) {
        let { noEffect } = config;
        if (noEffect) delete config.noEffect;
        config = Object.assign({ url, method: type, data: value }, config)
        let p = this.axios.request(config);

        //策略是否启用
        if (!noEffect) {
            return this.strategy(p);
        } else {
            return p;
        }
    }
    /**
     * @param {*} url
     * 使用get
     */
    baseGet = (url, value = "", config = {}) => {
        config.params = value;
        return this.baseRequest("get", url, config);
    };
    /**
     * @param {*} url
     * @param {*} value
     * 使用post
     */
    basePost = (url, value, config = {}) => {
        return this.baseRequest("post", url, value, config)
    };
    /**
     * @param {*} url
     * @param {*} value
     * 使用put
     */
    basePut = (url, value, config = {}) => {
        return this.baseRequest("put", url, value, config);
    };
    /**
     * @param {*} url
     * 使用delete
     */
    baseDelete = (url, value, config = {}) => {
        return this.baseRequest("delete", url, value, config);
    };
    /**
     * @param {*} url
     * 使用delete
     */
    baseXWwwFormPost = (url, value, config = {}) => {
        config.headers["content-type"] = "application/x-www-form-urlencoded";
        config.data = qs.stringify(value);
        return this.baseRequest("post", url, value, config);
    };
    /**
     * 获取原生axios
     */
    getAxios() {
        return axios;
    }
}

module.exports = DCHttp;
