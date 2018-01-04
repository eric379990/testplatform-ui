import axios from 'axios';

let base = 'api';

export const requestLogin = params => { console.log("test"); return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const testApi = params => { return axios.get(`api/test`); };

export const getApiList = params => { return axios.get(`api/getApiList`); };

export const getApiParameterDataInfo = params => { return axios.get(`api/getApiParameterDataInfo`, { params: params }); };

export const saveApiParameterDataInfo = params => { return axios.post(`api/saveApiParameterDataInfo`, { params: params }); };

