import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

export function userDetail(id) {
  return request({
    url: '/admin/user/detail',
    method: 'get',
    params: { id }
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}

export function listFeedback(query) {
  return request({
    url: '/admin/feedback/list',
    method: 'get',
    params: query
  })
}
export function updateFeedback(data) {
  return request({
    url: '/admin/feedback/update',
    method: 'post',
    data
  })
}

export function createFeedback(data) {
  return request({
    url: '/admin/feedback/create',
    method: 'post',
    data
  })
}

export function listUserOrderHistory(query) {
  return request({
    url: '/admin/order/listforadmin',
    method: 'get',
    params: query
  })
}

export function listUserPointHistory(query) {
  return request({
    url: '/admin/order/pointlistforadmin',
    method: 'get',
    params: query
  })
}
export function listProhibtUsers(query) {
  return request({
    url: '/admin/user/prohibitlist',
    method: 'get',
    params: query
  })
}
export function listProhibtUserId(query) {
  return request({
    url: '/admin/user/prohibitbyuserid',
    method: 'get',
    params: query
  })
}

export function fetchAnchorList(query) {
  return request({
    url: '/admin/anchor/list',
    method: 'get',
    params: query
  })
}

export function anchorDetail(id) {
  return request({
    url: '/admin/anchor/detail',
    method: 'get',
    params: { id }
  })
}

export function updateAnchor(data) {
  return request({
    url: '/admin/anchor/update',
    method: 'post',
    data
  })
}

export function listCollect(query) {
  return request({
    url: '/admin/collect/list',
    method: 'get',
    params: query
  })
}

export function listUserChatHistory(query) {
  return request({
    url: '/admin/chatroom/chathistory',
    method: 'get',
    params: query
  })
}

export function listRefereeHistory(query) {
  return request({
    url: '/admin/referee/list',
    method: 'get',
    params: query
  })
}

export function listRefereeHistoryById(query) {
  return request({
    url: '/admin/referee/listbyuserid',
    method: 'get',
    params: query
  })
}

