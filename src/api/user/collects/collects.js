import request from '@/utils/request'

// 查询用户收藏列表
export function listCollects(query) {
  return request({
    url: '/user/collects/list',
    method: 'get',
    params: query
  })
}

// 查询用户收藏详细
export function getCollects(colId) {
  return request({
    url: '/user/collects/' + colId,
    method: 'get'
  })
}

// 新增用户收藏
export function addCollects(data) {
  return request({
    url: '/user/collects',
    method: 'post',
    data: data
  })
}

// 修改用户收藏
export function updateCollects(data) {
  return request({
    url: '/user/collects',
    method: 'put',
    data: data
  })
}

// 删除用户收藏
export function delCollects(colId) {
  return request({
    url: '/user/collects/' + colId,
    method: 'delete'
  })
}
