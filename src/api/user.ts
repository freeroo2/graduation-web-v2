import { http } from "../utils/http";

interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
}

// 获取验证码
export const getVerify = (): userType => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (data: object) => {
  return http.request("post", "/login", { data });
};

// 刷新token
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};

// 查找管理员
export const findManagers = (params: object): resultType => {
  return http.request("get", "/user/find", { params: params });
};

// 新建管理员
export const createManager = (data: object): resultType => {
  return http.request("post", "/user/createManager", { data: data });
};

// 编辑管理员
export const editManager = (data: object): resultType => {
  return http.request("post", "/user/editManager", { data: data });
};

// 删除用户
export const userDelete = (params: object): resultType => {
  return http.request("get", "/user/delete", { params: params });
};

// 取消管理员身份
export const managerCancle = (params: object): resultType => {
  return http.request("get", "/role/cancleManager", { params: params });
};
