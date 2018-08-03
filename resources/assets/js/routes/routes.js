
// web
import Home from '../modules/home'
import About from '../modules/about'
import Contact from '../modules/contact'
// auth
import Login from '../modules/login'
import Register from '../modules/register'
import ForgotPassword from '../modules/forgotPassword'
import ResetPassword from '../modules/resetPassword'

// member
import Member from '../modules/member'

// admin
import Admin from '../modules/admin'
import Dashboard from '../modules/dashboard'
import Users from '../modules/users'
import Account from '../modules/account'
import Settings from '../modules/settings'

// 
import NoMatch from '../modules/noMatch' //404 page not found

const routes = [
    {
        path: '/',
        exact: true,
        auth: false,
        component: Home
    },
    {
        path: '/about',
        exact: true,
        auth: false,
        component: About
    },
    {
        path: '/contact',
        exact: true,
        auth: false,
        component: Contact
    },
    {
        path: '/login/:social',
        exact: false,
        auth: false,
        component: Home
    },
    {
        path: '/login',
        exact: true,
        auth: false,
        title: 'Login',
        component: Login
    },
    {
        path: '/register',
        exact: true,
        auth: false,
        title: 'Register',
        component: Register
    },
    {
        path: '/forgot-password',
        exact: true,
        auth: false,
        component: ForgotPassword
    },
    {
        path: '/reset-password/:token/:email',
        exact: true,
        auth: false,
        component: ResetPassword
    },
    
    /* Member */
    {
        path: '/m/:user',
        exact: true,
        auth: true,
        middleware: ['member'],
        title: 'Member',
        component: Member
    },

    /* Admin */
    {
        path: '/admin',
        exact: true,
        auth: true,
        middleware: ['admin'],
        component: Admin
    },
    {
        path: '/admin/dashboard',
        exact: true,
        auth: true,
        middleware: ['admin'],
        title: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/admin/users',
        exact: true,
        auth: true,
        middleware: ['admin'],
        title: 'Users',
        component: Users
    },
    {
        path: '/admin/account',
        exact: true,
        auth: true,
        middleware: ['admin'],
        title: 'Account',
        component: Account
    },
    {
        path: '/admin/settings',
        exact: true,
        auth: true,
        middleware: ['admin'],
        title: 'Settings',
        component: Settings
    },
    /* 404 */
    {
        path: '',
        exact: true,
        auth: false,
        title: 'Lost in space',
        component: NoMatch,
    }
];

export default routes;
