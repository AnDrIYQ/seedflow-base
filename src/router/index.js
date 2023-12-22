import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        meta: {
            access: 'public',
        },
        component: () => import('@/views/MainForm.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

const ACCESS_SCHEMA_REDIRECTS = {
    'admin': {
        'admin_only': false,
        'public': false,
        'guest_only': '/admin',
        'customer_only': '/login',
    },
    'customer': {
        'admin_only': '/login',
        'public': false,
        'guest_only': '/',
        'customer_only': false,
    },
    'guest': {
        'admin_only': '/',
        'public': false,
        'guest_only': false,
        'customer_only': '/login',
    },
};

const getAccess = () => {
    const token = JSON.parse(window.localStorage.getItem('application_seedflow'));
    if (!token?.auth) {
        return 'guest';
    }
    const role = token?.auth?.role;
    if (role) {
        return role;
    }
    return 'guest';
};

const checkAccess = (needAccess) => {
    const currentAccess = getAccess();
    return ACCESS_SCHEMA_REDIRECTS[currentAccess][needAccess];
};

router.beforeEach((to, from, next) => {
    const redirect = checkAccess(to.meta.access);
    if (redirect) {
        next(redirect);
    }
    next();
});

export default router;