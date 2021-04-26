import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

NProgress.configure( { showSpinner: false } )

const whiteList = [ '/login', '/auth-redirect', '/bind', '/register' ]

router.beforeEach( ( to, from, next ) => {
	NProgress.start()
	const { redirectURL } = to.query
	if ( getToken() ) {
		if ( to.path === '/logout' ) {
			next()
			NProgress.done()
		}else if ( to.path ==='/login' ){
			// 判断当前用户是否已拉取完user_info信息
			store.dispatch( 'GetInfo' ).then( () => {
				if ( redirectURL && redirectURL.length > 0 ) {
					if ( to.path === '/login' ) {
						NProgress.done()
						window.location.href = redirectURL
					}
				}
				next( { ...to, replace: true } )
				NProgress.done()
			} ).catch( err => {
				store.dispatch( 'LogOut' ).then( () => {
					// Message.error( err )
					next( { path: '/login', query: { redirectURL } } )
					NProgress.done()
				} ).catch(res=>{
					next( { path: '/login', query: { redirectURL } } )
					NProgress.done()
				})
			} )
		} else {
			if ( store.getters.roles.length === 0 ) {
				// 判断当前用户是否已拉取完user_info信息
				store.dispatch( 'GetInfo' ).then( () => {
					if ( redirectURL && redirectURL.length > 0 ) {
						if ( to.path === '/login' ) {
							NProgress.done()
							window.location.href = redirectURL
						}
					}
					next( { ...to, replace: true } )
					NProgress.done()
				} ).catch( err => {
					store.dispatch( 'LogOut' ).then( () => {
						// Message.error( err )
						next( { path: '/login', query: { redirectURL } } )
						NProgress.done()
					} ).catch(res=>{
						next( { path: '/login', query: { redirectURL } } )
						NProgress.done()
					})
				} )
			} else {
				if ( to.path === '/login' ) {
					next( { path: '/apps' } )
				}
				next()
			}
		}
	} else {
		// 没有token
		if ( whiteList.indexOf( to.path ) !== -1 ) {
			// 在免登录白名单，直接进入
			next()
			NProgress.done()
		} else {
			next( `/login?redirectURL=${to.fullPath}` ) // 否则全部重定向到登录页
			NProgress.done()
		}
	}
} )

router.afterEach( () => {
	NProgress.done()
} )
