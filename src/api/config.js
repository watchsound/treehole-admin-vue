import request from '@/utils/request'

export function list() {
  return request({
    url: '/admin/config/list',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/admin/config/update',
    method: 'post',
    data
  })
}
export function orderlist() {
  return request({
    url: '/admin/config/order',
    method: 'get'
  })
}

export function orderupdate(data) {
  return request({
    url: '/admin/config/orderupdate',
    method: 'post',
    data
  })
}

export function listWx() {
  return request({
    url: '/admin/config/wx',
    method: 'get'
  })
}

export function updateWx(data) {
  return request({
    url: '/admin/config/wxupdate',
    method: 'post',
    data
  })
}
export function listPromotion(query) {
  return request({
    url: '/admin/config/listpromotion',
    method: 'get',
    params: query
  })
}

export function updatePromotion(data) {
  return request({
    url: '/admin/config/updatepromotion',
    method: 'post',
    data
  })
}
export function createPromotion(data) {
  return request({
    url: '/admin/config/createpromotion',
    method: 'post',
    data
  })
}
