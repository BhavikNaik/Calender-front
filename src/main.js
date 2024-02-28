import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import reg from './components/Reg.vue'
import login from './components/Login.vue'
import HomeVue from './components/Home.vue'
import AghomeVue from './components/Aghome.vue'
import AdhomeVue from './components/Adhome.vue'
import './components/styles.css'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
// import { Kalendar } from 'kalendar-vue';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import VueCookies from 'vue-cookies'
//import CalenderVue from './components/Calender.vue'
//import VueTable from 'vue-js-table';

const app = createApp(App)

app.use(setupCalendar, {})
app.use(Toast)
app.use(VueCookies);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: reg },
        { path: '/login', component: login, name: 'Login' },
        { path: '/home', component: HomeVue, meta: { requiresAuth: true }},
        { path: '/aghome', component: AghomeVue, meta: { requiresAuth: true }},
        { path: '/adhome', component: AdhomeVue, meta: { requiresAuth: true }},
        // meta: { requiresAuth: true }
    ]
});
app.use(router);

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            // Checking if user is authenticated

            // if(VueCookies.isKey('email')){
            //     next();
            // }else{
            //     next({ name: 'Login' });
            // }

            const response = await axios.get(`http://localhost:3000/api/home`,{withCredentials:true});
            if (response.data.success) {
                console.log("hai bhai",response)
                next();
            } else {
                console.log("thoda problem hai bhai",response)
                next({ name: 'Login' });
            }

            // .then((response) => {
            //     console.log("hua",response)
            // }).catch((err) => {
            //     console.log("nai",err)
            // })
        } catch (error) {
            // An error occurred while checking authentication status
            // console.log("issue",response)
            console.error('Error checking authentication status:', error);
            next({ name: 'Login' });
        }
    } else {
        // console.log("nahi hai")
        next();
    }
});


// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
// app.component('vue-table', VueTable);

app.mount('#app')
