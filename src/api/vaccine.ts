import { http } from "../utils/http";
// 获取所有疫苗种类
export const getVaccines = (): resultType => {
  return http.request("get", "/vaccine-types/list");
};

// 添加pcr检测记录
export const addPcr = (data: object): resultType => {
  return http.request("post", "/pcr_test/add", { data: data });
};

// 添加疫苗接种记录
export const addVaccineRecord = (data: object): resultType => {
  return http.request("post", "/vaccine/add", { data: data });
};
