import { http } from "../utils/http";

// 查找用户姓名对应所有健康上报记录，分页
export const findReports = (params: object): resultType => {
  return http.request("get", "/q-report/find", { params: params });
};

// 查找用户姓名对应所有健康上报记录，不分页
export const findReportsToList = (params: object): resultType => {
  return http.request("get", "/q-report/list", { params: params });
};

// 查找用户姓名对应所有健康上报记录 withcid
export const findReportsWithCid = (params: object): resultType => {
  return http.request("get", "/q-report/findWithCid", { params: params });
};

// 添加健康上报记录
export const createReport = (data: object): resultType => {
  return http.request("post", "/q-report/add", { data: data });
};

// 编辑健康上报记录
export const editReport = (data: object): resultType => {
  return http.request("post", "/q-report/add", { data: data });
};

// 删除健康上报记录
export const deleteReport = (params: object): resultType => {
  return http.request("get", "/q-report/delete", { params: params });
};

// 检查用户当天是否已经打卡
export const isChecked = (params: object): resultType => {
  return http.request("get", "/q-report/isChecked", { params: params });
};
