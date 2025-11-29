import request from "@/utils/request";

// 调用 AI 教学建议接口
export function generateTeachingSuggestions(data) {
  return request({
    url: "http://localhost:8000/api/analyze/teaching", // 改成实际Python服务的端口
    method: "post",
    data,
  });
}
