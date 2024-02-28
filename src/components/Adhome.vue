<template>
    <div class="fullbg">
        <div class="nav">
            <h2 style="display: flex;flex-wrap: nowrap;"><span class="fas fa-solid fa-calendar" style="margin-right: 8px;"></span>Calendar</h2>
            <!-- <span class="fas fa-sharp fa-regular fa-list" style="margin-right: 8px;"></span> -->
            <div class="navright">
                <!-- <button class="createEvent" @click="getEvents">Get Events</button> -->
                <!-- <button class="createEvent" @click="ifAuth">Email</button> -->
                <button class="createEvent" @click="showToast">Create Event</button>
                <div class="dropdown-rem">
                    <button @click="toggleDropdownRem" class="reminder"><span class="fa fa-bell" style="font-size: 23px;padding: 8px 12px;color: aliceblue;"></span></button>
                    <!-- <div v-if="isOpen" class="dropdown-content"> -->
                    
                    <div class="inner-scrol" v-if="isOpenRem">
                        <div v-for="invitatio in invitations" class="dropdown-content-rem" v-on:click="openModal(invitatio)">
                            <div class="inner-content">
                                <div>Title: {{invitatio.title}}</div>
                                <div>Time: {{invitatio.start}} - {{invitatio.end}}</div>
                                <div>Invited by: {{invitatio.hostEmail}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button @click="logout">
                <!-- <div v-show="!isLarge" class="createEvent">Logout</div> -->
                    <div class="logout"><img src="http://localhost:5173/src/assets/logout.png" style="max-width:30px;max-height: 20px;padding: 0;"/></div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import CreateEvent from './CreateEvent.vue'
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    components: {
        CreateEvent,
    },
    data() {
        return {
            isAuthenticated: false,
            showT: false,
            isLarge: true,
            userId: '',
            isOpen: false,
            invitations: [],
            eventstarts: [],
            isOpenMod: false,
            isOpenRem: false,
        }
    },
    // computed:{
    //     // if(window.innerWidth < 600){
    //     //     this.isLarge = false
    //     // }
    //     isLoggedIn() {
    //         return VueCookies.isKey('email');
    //     }
    // },
    async mounted() {
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            const userData = response.data;
            console.log(userData); // This will contain information about the currently logged-in user
            this.userId = response.data._id;
        } catch (error) {
            console.error("errrr",error);
        }
        
    },
    methods: {
        toggleDropdownRem() {
            this.isOpenRem = !this.isOpenRem;
            console.log(this.invitations);
        },
         triggerToast(msg) {
            const toast = useToast();
            
            toast(`${msg}`, {
            position: "bottom-right",
            timeout: 2500,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            hideProgressBar: true,
            closeButton: "button",
            icon: "far fa-thumbs-up",
            rtl: false
            });
         },
        async logout() {
            try {
                const response = await axios.post('http://localhost:3000/auth/logout', null, {  withCredentials: true });
                const userData = response.data;
                console.log(userData);
                this.triggerToast('Logout Successful !!');
                
                this.$router.push('/login')
            } catch (error) {
                console.error("errrr",error);
            }
        },
        // async ifAuth(){
        //     try {
        //         const response = await axios.get('http://localhost:3000/home',{  withCredentials: true });
        //         const userData = response.data;
        //         console.log(userData); // This will contain information about the currently logged-in user
        //     } catch (error) {
        //         console.error("errrr",error);
        //     }
        // },
        openModal(invitation) {
            this.isOpenMod = true;
            this.selectedInvitation = invitation;
        },
        closeModal() {
            this.isOpenMod = false;
        },
        showToast() {
            this.showT = true
        },
        closeToast() {
            this.showT = false
        },
        handleFormSubmitted() {
            this.showT = false
            console.log("Submitted")
        },
    }
}
</script>

<style>

</style>