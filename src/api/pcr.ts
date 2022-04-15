import { http } from "../utils/http";
// 查找用户姓名对应所有pcr检测记录
export const findPcrs = (params: object): resultType => {
  return http.request("get", "/pcr_test/find", { params: params });
};

// 添加pcr检测记录
export const createPcr = (data: object): resultType => {
  return http.request("post", "/pcr_test/add", { data: data });
};

// 编辑pcr检测记录
export const editPcr = (data: object): resultType => {
  return http.request("post", "/pcr_test/add", { data: data });
};

// 删除pcr检测记录
export const pcrDelete = (params: object): resultType => {
  return http.request("get", "/pcr_test/delete", { params: params });
};
