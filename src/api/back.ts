import { http } from "../utils/http";

// 查找用户姓名对应所有返乡申请记录，分页
export const findBacks = (params: object): resultType => {
  return http.request("get", "/q-back/find", { params: params });
};

// 查找用户id对应所有返乡申请记录，不分页
export const findBacksToList = (params: object): resultType => {
  return http.request("get", "/q-back/list", { params: params });
};

// 查找用户姓名对应所有返乡申请记录 withcid
export const findBacksWithCid = (params: object): resultType => {
  return http.request("get", "/q-back/findWithCid", { params: params });
};

// 添加返乡申请记录
export const createBack = (data: object): resultType => {
  return http.request("post", "/q-back/add", { data: data });
};

// 编辑返乡申请记录
export const editBack = (data: object): resultType => {
  return http.request("post", "/q-back/add", { data: data });
};

// 删除返乡申请记录
export const deleteBack = (params: object): resultType => {
  return http.request("get", "/q-back/delete", { params: params });
};
