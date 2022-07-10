import request from '@/utils/request'

// 查询评论表 用户评论列表
export function listComment(query) {
  return request({
    url: '/product/comment/list',
    method: 'get',
    params: query
  })
}

// 查询评论表 用户评论详细
export function getComment(comId) {
  return request({
    url: '/product/comment/' + comId,
    method: 'get'
  })
}

// 新增评论表 用户评论
export function addComment(data) {
  return request({
    url: '/product/comment',
    method: 'post',
    data: data
  })
}

// 修改评论表 用户评论
export function updateComment(data) {
  return request({
    url: '/product/comment',
    method: 'put',
    data: data
  })
}

// 删除评论表 用户评论
export function delComment(comId) {
  return request({
    url: '/product/comment/' + comId,
    method: 'delete'
  })
}
