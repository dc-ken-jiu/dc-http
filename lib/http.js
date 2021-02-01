/*
 * @Description:
 * @Author: dingxuejin
 * @Date: 2021-02-01 10:17:19
 * @LastEditTime: 2021-02-01 10:29:42
 * @LastEditors: dingxuejin
 */
import axios from "../tool";

/**
 * @param {*} url
 * 使用get
 */
export const baseGet = (url, config = {}) => {
    config.method = "get";
    config.url = url;
    return base(config);
};

/**
 * @param {*} url
 * @param {*} value
 * 使用post
 */
export const basePost = (url, value, config = {}) => {
    config.method = "post";
    config.url = url;
    config.data = value;
    return base(config);
};

/**
 * @param {*} url
 * @param {*} value
 * 使用put
 */
export const basePut = (url, value, config = {}) => {
    config.method = "put";
    config.url = url;
    config.data = value;
    return base(config);
};

/**
 * @param {*} url
 * 使用delete
 */
export const baseDelete = (url, value, config = {}) => {
    config.method = "delete";
    config.url = url;
    return base(config);
};

/**
 * @param {*} type
 * @param {*} url
 * @param {*} value
 * 请求基础配置
 */
function base(config) {
    if (!config.url) return;

    //取消请求
    const CancelToken = axios.CancelToken;
    let cancel;
    config.cancelToken = new CancelToken(function executor(c) {
        cancel = c;
    })

    //返回结果
    let res = axios.request(config).catch(error => {
        error.message && (error.msg = error.message);
        return Promise.reject(error);
    });

    res.cancel = cancel;

    return res;
}
