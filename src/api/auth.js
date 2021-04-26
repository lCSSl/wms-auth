import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
	return request({
		url: '/auth/login',
		method: 'post',
		data: { username, password, code, uuid }
	})
}

// 刷新方法
export function refreshToken() {
	return request({
		url: '/auth/refresh',
		method: 'post'
	})
}

// 退出方法
export function logout() {
	return request({
		url: '/auth/logout',
		method: 'delete'
	})
}
