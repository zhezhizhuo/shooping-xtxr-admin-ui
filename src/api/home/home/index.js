import request from '@/utils/request'

// 查询 新鲜好物列表
export function listNews() {
  return request({
    url: '/home/new',
    method: 'get',
  })
}


