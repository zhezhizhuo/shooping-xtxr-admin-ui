import request from '@/utils/request'

// 查询商品信息列表
export function listProduct(query) {
  return request({
    url: '/product/product/list',
    method: 'get',
    params: query
  })
}
// 查询 人气推荐列表
export function listHots(query) {
  return request({
    url: '/product/product/hot',
    method: 'get',
    params:query
  })
}
// 查询商品信息详细
export function getProduct(productId) {
  return request({
    url: '/product/product/' + productId,
    method: 'get'
  })
}

// 根据商品id 查询 所有图片
export function getProductImgs(productId) {
  return request({
    url: '/product/product/img/' + productId,
    method: 'get'
  })
}


// 新增商品信息
export function addProduct(data) {
  return request({
    url: '/product/product',
    method: 'post',
    data: data
  })
}
// 新增商品信息
export function addImgs(data) {
  return request({
    url: '/product/product/imgs',
    method: 'post',
    data: data
  })
}

// 修改商品信息
export function updateProduct(data) {
  return request({
    url: '/product/product',
    method: 'put',
    data: data
  })
}

// 删除商品信息
export function delProduct(productId) {
  return request({
    url: '/product/product/' + productId,
    method: 'delete'
  })
}
