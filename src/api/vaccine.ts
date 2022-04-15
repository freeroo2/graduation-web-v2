import { http } from "../utils/http";
// 获取所有疫苗种类
export const getVaccines = (): resultType => {
  return http.request("get", "/vaccine-types/list");
};

// 查找用户姓名对应所有pcr检测记录
export const findVaccineRecords = (params: object): resultType => {
  return http.request("get", "/vaccine/find", { params: params });
};

// 添加疫苗接种记录
export const addVaccineRecord = (data: object): resultType => {
  return http.request("post", "/vaccine/add", { data: data });
};

// 编辑疫苗接种记录
export const editVaccineRecord = (data: object): resultType => {
  return http.request("post", "/vaccine/add", { data: data });
};

// 删除疫苗接种记录
export const deleteVaccineRecord = (params: object): resultType => {
  return http.request("get", "/vaccine/delete", { params: params });
};
