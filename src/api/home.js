import request from '@/utils/request'

// 获取 index 页面参数
export const getData = () => {
  return request({
    url: '/index/data',
    method: 'get'
  })
}
