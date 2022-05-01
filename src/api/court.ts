import { http } from "../utils/http";
// 查找所有小区
export const findCourts = (): resultType => {
  return http.request("get", "/courts");
};
