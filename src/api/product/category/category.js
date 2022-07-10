import request from '@/utils/request'

// 查询商品类目列表
export function listCategory(query) {
  return request({
    url: '/product/category/list',
    method: 'get',
    params: query
  })
}


// 查询商品类目下拉树结构
export function treeselect() {
  return request({
    url: '/product/category/treeselect',
    method: 'get'
  })
}

// 查询商品类目详细
export function getCategory(categoryId) {
  return request({
    url: '/product/category/' + categoryId,
    method: 'get'
  })
}
//获取每个分类占比的数据
export function getChartData() {
  return request({
    url: '/product/category/chart/',
    method: 'get'
  })
}
// 新增商品类目
export function addCategory(data) {
  return request({
    url: '/product/category',
    method: 'post',
    data: data
  })
}

// 修改商品类目
export function updateCategory(data) {
  return request({
    url: '/product/category',
    method: 'put',
    data: data
  })
}

// 删除商品类目
export function delCategory(categoryId) {
  return request({
    url: '/product/category/' + categoryId,
    method: 'delete'
  })
}
