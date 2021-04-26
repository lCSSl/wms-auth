import Cookies from 'js-cookie'

const TokenKey = 'Access-Token'

const ExpiresInKey = 'Access-Expires-In'
const domain = process.env['VUE_APP_COOKIE_DOMAIN']

export function getToken() {
	return Cookies.get( TokenKey )
}

export function setToken( token ) {
	return Cookies.set( TokenKey, token, {  domain } )
}

export function removeToken() {
	return Cookies.remove( TokenKey )
}

export function getExpiresIn() {
	return Cookies.get( ExpiresInKey ) || -1
}

export function setExpiresIn( time ) {
	return Cookies.set( ExpiresInKey, time , { domain })
}

export function removeExpiresIn() {
	return Cookies.remove( ExpiresInKey )
}
