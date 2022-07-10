import request from '@/utils/request'

// 查询用户足迹列表
export function listFoot(query) {
  return request({
    url: '/user/foot/list',
    method: 'get',
    params: query
  })
}

// 查询用户足迹详细
export function getFoot(ftId) {
  return request({
    url: '/user/foot/' + ftId,
    method: 'get'
  })
}

// 新增用户足迹
export function addFoot(data) {
  return request({
    url: '/user/foot',
    method: 'post',
    data: data
  })
}

// 修改用户足迹
export function updateFoot(data) {
  return request({
    url: '/user/foot',
    method: 'put',
    data: data
  })
}

// 删除用户足迹
export function delFoot(ftId) {
  return request({
    url: '/user/foot/' + ftId,
    method: 'delete'
  })
}
