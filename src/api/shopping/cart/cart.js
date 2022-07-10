import request from '@/utils/request'

// 查询用户购物车列表
export function listCart(query) {
  return request({
    url: '/order/cart/list',
    method: 'get',
    params: query
  })
}

// 查询用户购物车详细
export function getCart(id) {
  return request({
    url: '/order/cart/' + id,
    method: 'get'
  })
}

// 新增用户购物车
export function addCart(data) {
  return request({
    url: '/order/cart',
    method: 'post',
    data: data
  })
}

// 修改用户购物车
export function updateCart(data) {
  return request({
    url: '/order/cart',
    method: 'put',
    data: data
  })
}

// 删除用户购物车
export function delCart(id) {
  return request({
    url: '/order/cart/' + id,
    method: 'delete'
  })
}
