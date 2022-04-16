import { http } from "../utils/http";

// 用于超管查找隔离用户中今日未打卡的用户id数组
export const getNotCheckedToday = (): resultType => {
  return http.request("get", "/q-daily/getNotCheckedToday");
};

// 用于管理员查找隔离用户中今日未打卡的用户id数组
export const getNotCheckedTodayWithCid = (params: object): resultType => {
  return http.request("get", "/q-daily/getNotCheckedTodayWithCid", {
    params: params
  });
};

// 用于管理员获取当前管理员所在小区的所有隔离中的用户，返回为一个列表，不分页
export const getAllQuarantineWithCid = (): resultType => {
  return http.request("get", "/user/getAllQuarantineWithCid");
};

// 用于超管获取所有小区的所有隔离中的用户，返回为一个列表，不分页
export const getAllQuarantine = (params: object): resultType => {
  return http.request("get", "/user/getAllQuarantine", {
    params: params
  });
};

// 查找用户姓名对应所有隔离检查记录
export const findDailys = (params: object): resultType => {
  return http.request("get", "/q-daily/find", { params: params });
};

// 查找用户姓名对应所有pcr检测记录 withcid
export const findDailysWithCid = (params: object): resultType => {
  return http.request("get", "/q-daily/findWithCid", { params: params });
};

// 添加隔离检查记录
export const createDaily = (data: object): resultType => {
  return http.request("post", "/q-daily/add", { data: data });
};

// 编辑隔离检查记录
export const editDaily = (data: object): resultType => {
  return http.request("post", "/q-daily/add", { data: data });
};

// 删除隔离检查记录
export const dailyDelete = (params: object): resultType => {
  return http.request("get", "/q-daily/delete", { params: params });
};
