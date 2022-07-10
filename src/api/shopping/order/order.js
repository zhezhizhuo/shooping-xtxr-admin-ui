import request from '@/utils/request'

// 查询用户订单表列表
export function listOrder(query) {
  return request({
    url: '/shopping/order/list',
    method: 'get',
    params: query
  })
}

// 查询用户订单表详细
export function getOrder(id) {
  return request({
    url: '/shopping/order/' + id,
    method: 'get'
  })
}

// 新增用户订单表
export function addOrder(data) {
  return request({
    url: '/shopping/order',
    method: 'post',
    data: data
  })
}

// 修改用户订单表
export function updateOrder(data) {
  return request({
    url: '/shopping/order',
    method: 'put',
    data: data
  })
}

// 删除用户订单表
export function delOrder(id) {
  return request({
    url: '/shopping/order/' + id,
    method: 'delete'
  })
}
