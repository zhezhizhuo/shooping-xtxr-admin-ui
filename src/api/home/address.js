import request from '@/utils/request'

// 查询地址管理列表
export function listAddress(query) {
  return request({
    url: '/user/address/list',
    method: 'get',
    params: query
  })
}

// 查询地址管理详细
export function getAddress(id) {
  return request({
    url: '/user/address/' + id,
    method: 'get'
  })
}



// 新增地址管理
export function addAddress(data) {
  return request({
    url: '/user/address',
    method: 'post',
    data: data
  })
}

// 修改地址管理
export function updateAddress(data) {
  return request({
    url: '/user/address',
    method: 'put',
    data: data
  })
}

// 删除地址管理
export function delAddress(id) {
  return request({
    url: '/user/address/' + id,
    method: 'delete'
  })
}
