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

// 查找用户姓名对应所有隔离检查记录
export const findDailys = (params: object): resultType => {
  return http.request("get", "/q-daily/find", { params: params });
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
