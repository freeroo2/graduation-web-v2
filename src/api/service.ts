import { http } from "../utils/http";

// 查找用户姓名对应所有隔离服务记录
export const findServices = (params: object): resultType => {
  return http.request("get", "/q-service/find", { params: params });
};

// 查找用户姓名对应所有隔离服务记录 withcid
export const findServicesWithCid = (params: object): resultType => {
  return http.request("get", "/q-service/findWithCid", { params: params });
};

// 添加隔离服务记录
export const createService = (data: object): resultType => {
  return http.request("post", "/q-service/add", { data: data });
};

// 编辑隔离服务记录
export const editService = (data: object): resultType => {
  return http.request("post", "/q-service/add", { data: data });
};

// 删除隔离服务记录
export const deleteService = (params: object): resultType => {
  return http.request("get", "/q-service/delete", { params: params });
};
