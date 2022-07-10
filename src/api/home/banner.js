import request from '@/utils/request'

// 查询主页轮播列表
export function listBanner(query) {
  return request({
    url: '/banner/banner/list',
    method: 'get',
    params: query
  })
}

// 查询主页轮播详细
export function getBanner(id) {
  return request({
    url: '/banner/banner/' + id,
    method: 'get'
  })
}

// 新增主页轮播
export function addBanner(data) {
  return request({
    url: '/banner/banner',
    method: 'post',
    data: data
  })
}

// 修改主页轮播
export function updateBanner(data) {
  return request({
    url: '/banner/banner',
    method: 'put',
    data: data
  })
}

// 删除主页轮播
export function delBanner(id) {
  return request({
    url: '/banner/banner/' + id,
    method: 'delete'
  })
}
