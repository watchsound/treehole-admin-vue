import request from '@/utils/request'

export function listTimeslotplan(query) {
    return request({
        url: '/admin/chatroom/listtimeslotplan',
        method: 'get',
        params: query
    })
}

export function addTimeslotplan(data) {
    return request({
        url: '/admin/chatroom/createtimeslotplan',
        method: 'post',
        data
    })
}

export function updateTimeslotplan(data) {
    return request({
        url: '/admin/chatroom/updatetimeslotplan',
        method: 'post',
        data
    })
}

export function deleteTimeslotplan(data) {
    return request({
        url: '/admin/chatroom/deletetimeslotplan',
        method: 'post',
        data
    })
}

export function getScheduleForDay(query) {
    return request({
        url: '/admin/chatroom/getscheduleforday',
        method: 'get',
        params: query
    })
}

export function getUnfinishedDateInMonth(query) {
    return request({
        url: '/admin/chatroom/getunfinisheddateinmonth',
        method: 'get',
        params: query
    })
}


export function createScheduleForDay(data) {
    return request({
        url: '/admin/chatroom/createscheduleforday',
        method: 'post',
        data
    })
}

export function updateScheduleForDay(data) {
    return request({
        url: '/admin/chatroom/updatescheduleforday',
        method: 'post',
        data
    })
}

export function getChatroomStatisticByDate(query) {
    return request({
        url: '/admin/chatroom/listbydate',
        method: 'get',
        params: query
    })
}

