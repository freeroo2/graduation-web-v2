import { http } from "../utils/http";

// 获取当前隔离人数和密接人数
export const queryQuarantineAndContact = (): resultType => {
  return http.request("get", "/user/queryQuarantineAndContact");
};
