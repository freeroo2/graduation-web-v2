import { http } from "../utils/http";

// 获取当前用户的角色
export const getCurRole = (params: object): resultType => {
  return http.request("get", "/role/getRole", { params: params });
};
