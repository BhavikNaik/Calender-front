import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import reg from './components/Reg.vue'
import login from './components/Login.vue'
import HomeVue from './components/Home.vue'
import './components/styles.css'
import axios from 'axios'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
//import CalenderVue from './components/Calender.vue'

const app = createApp(App)

app.use(setupCalendar, {})
app.use(Toast)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: reg },
        { path: '/login', component: login, name: 'Login' },
        { path: '/home', component: HomeVue },
        // meta: { requiresAuth: true }
    ]
});
app.use(router);

// router.beforeEach(async (to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         try {
//             // Check if the user is authenticated
//             const response = await axios.get('http://localhost:3000/check-auth'); // You need to implement this endpoint in your backend
//             if (response.data.isAuthenticated) {
//                 next();
//             } else {
//                 next({ name: 'Login' });
//             }
//         } catch (error) {
//             // An error occurred while checking authentication status
//             console.error('Error checking authentication status:', error);
//             next({ name: 'Login' });
//         }
//     } else {
//         next();
//     }
// });


// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

app.mount('#app')
