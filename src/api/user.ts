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

// 新建用户
export const createUser = (data: object): resultType => {
  return http.request("post", "/user/createUser", { data: data });
};

// 新建管理员
export const createManager = (data: object): resultType => {
  return http.request("post", "/user/createManager", { data: data });
};

// 编辑管理员
export const editManager = (data: object): resultType => {
  return http.request("post", "/user/edit", { data: data });
};

// 删除用户
export const userDelete = (params: object): resultType => {
  return http.request("get", "/user/delete", { params: params });
};

// 取消管理员身份
export const managerCancle = (params: object): resultType => {
  return http.request("get", "/role/cancelManager", { params: params });
};

// 获取当前管理员所在小区的所有用户
export const userSearchByCid = (params: object): resultType => {
  return http.request("get", "/user/findByCidWithSearch", { params: params });
};

// 获取所有用户
export const fetAllUsersWithSearch = (params: object): resultType => {
  return http.request("get", "/users", { params: params });
};

// 用于超管获取所有用户，返回列表形式，不分页
export const findToArray = (params: object): resultType => {
  return http.request("get", "/user/findToArray", { params: params });
};

// 用于管理员查看所属小区所有用户，返回为列表，不分页
export const findByCidToArray = (params: object): resultType => {
  return http.request("get", "/user/findByCidToArray", { params: params });
};

// 重置为默认密码
export const resetKey = (params: object): resultType => {
  return http.request("get", "/user/resetKey", { params: params });
};

// 将列表中的用户设为隔离
export const beginQuarantine = (params: object): resultType => {
  return http.request("get", "/user/beginQuarantine", { params: params });
};

// 将列表中的用户解除隔离
export const endQuarantine = (params: object): resultType => {
  return http.request("get", "/user/endQuarantine", { params: params });
};

// 将列表中的用户设为密接
export const beginContact = (params: object): resultType => {
  return http.request("get", "/user/beginContact", { params: params });
};

// 将列表中的用户解除密接
export const endContact = (params: object): resultType => {
  return http.request("get", "/user/endContact", { params: params });
};
