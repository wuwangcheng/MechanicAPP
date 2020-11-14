import axios from "axios"
import Cookies from 'js-cookie'
import qs from 'qs'
import isPlainObject from "lodash/isPlainObject"
import { BASE_API, Geo_API } from "../config/environment"

export const http = axios.create({
    baseURL: BASE_API,
    timeout: 1000 * 60
})

export const GeoHttp = axios.create({
    baseURL: Geo_API,
    timeout: 1000 * 60
})
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    // config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
    config.headers['authorization'] = Cookies.get('token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkRlbW8ifQ.DHVPIaDpbzxsNTdRoMYVXoXA_3AmqPuvAj3B1f5d5DQ'

    // 默认参数
    // 防止缓存，GET请求默认带_t参数
    const defaults = {}
    if (config.method === 'get' || config.method === 'GET') {
        config.params = {
            ...config.params,
            ...{
                '_t': new Date().getTime()
            }
        }
    }

    if (isPlainObject(config.params)) {
        config.params = {
            ...defaults,
            ...config.params
        }
    }

    if (isPlainObject(config.data)) {
        config.data = {
            ...defaults,
            ...config.data
        }
        if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
            config.data = qs.stringify(config.data)
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})


/**
 * 请求拦截
 */
GeoHttp.interceptors.request.use(config => {
    // 默认参数
    // 防止缓存，GET请求默认带_t参数
    const defaults = {}
    if (config.method === 'get' || config.method === 'GET') {
        config.params = {
            ...config.params,
            ...{
                '_t': new Date().getTime()
            }
        }
    }

    if (isPlainObject(config.params)) {
        config.params = {
            ...defaults,
            ...config.params
        }
    }

    if (isPlainObject(config.data)) {
        config.data = {
            ...defaults,
            ...config.data
        }
        if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
            config.data = qs.stringify(config.data)
        }
    }

    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})
