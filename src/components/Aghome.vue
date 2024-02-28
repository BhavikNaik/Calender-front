<template>
    <div class="fullbgAg">
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
        <div>
            <!-- <table class="table">
                <thead class="table-head">
                    <tr class="table-head-all">
                        <th class="head-single">Title</th>
                        <th class="head-single">Time</th>
                        <th class="head-single">Status</th>
                        <th class="head-single">Description</th>
                        <th class="head-single">Actions</th>
                    </tr>
                </thead>
                <tbody class="table-body">
                    <tr v-for="event in tableData" :key="event.id" class="table-body-all">
                        <td class="body-single">{{event.title}}</td>
                        <td class="body-single">{{event.time}}</td>
                        <td class="body-single">{{event.status}}</td>
                        <td class="body-single">{{event.description}}</td>
                        <td class="body-single">
                            <button @click="editEvent(event.id)">Edit</button>
                            <button @click="deleteEvent(event.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table> -->
            <div class="table-container">
                <div class="table">
                    <div class="table-head-all">
                        <div class="head-single">Title</div>
                        <div class="head-single">Time</div>
                        <div class="head-single">Status</div>
                        <div class="head-single">Description</div>
                        <div class="head-single">Actions</div>

                    </div>
                    <div class="table-body-all" v-for="event in tableData" :key="event.id">
                        <div class="body-single">{{ event.title }}</div>
                        <div class="body-single">{{ event.time }}</div>
                        <div class="body-single">{{ event.status }}</div>
                        <div class="body-single">{{ event.description }}</div>
                        <div class="body-single">
                            <button @click="deleteEvent(event.id)">Delete</button>
                        </div>

                    </div>
                </div>
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
            tableData: [
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
            ]
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
            this.getInvitations();
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
        async getInvitations(){
            try {
                const response = await axios.get(`http://localhost:3000/api/invitations`, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.invitations = [];

                userData.forEach(item => {
                    // Push each item into the events array
                    let datePart = item.startDate.slice(0, 10);
                    let timePart = item.startDate.slice(11, 16);
                    let dateTimeString = `${datePart} ${timePart}`;
                    this.stime = dateTimeString;
                    datePart = item.endDate.slice(0, 10);
                    timePart = item.endDate.slice(11, 16);
                    dateTimeString = `${datePart} ${timePart}`;
                    this.etime = dateTimeString;
                    console.log(this.stime, this.etime)

                    this.invitations.push({
                        title: item.title,
                        description: item.description,
                        start: this.stime,
                        end: this.etime,
                        host: item.host,
                        hostEmail: item.hostEmail, 
                        id: item._id,
                    });

                    // this.invitestarts.push({
                    //     start: this.stime.slice(0,10),
                    // });
                });
                // console.log("thid",this.invitestarts);

            } catch (error) {
                console.error("errrr",error);
            }
        },
        openModal(invitation) {
            this.isOpenMod = true;
            this.selectedInvitation = invitation;
        },
        // openModalRem(invitation) {
        //     this.isOpenMod = true;
        //     this.selectedInvitation = invitation;
        // },
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
.fullbgAg{
    background-color: linear-gradient(to right, #0026ff, #0040ff, #0751f1, #cecece);
    height: 100vh;
}

.table-container {
    max-height: calc(100vh - 100px);
    overflow-x: auto;
    /* background-color: linear-gradient(to right, #0026ff, #0040ff, #0751f1, #cecece); */
}

.table{
    /* border: 1px solid #747373; */
    margin: 0 10px;
    min-width: 660px; 
    display: flex;
    flex-direction: column;
    max-width: 100%;
}

/* .table-head{
    border-bottom: 1px solid #e59797;
    background-color: rgb(0, 60, 255);
    color: white;
    margin: 100px 20px;
}

.table-body{
    border-top: 1px solid #e59797;
    background-color: #d4d4d4;
    color: black;
    border-collapse: collapse;
    margin: 10px 20px;
} */

.table-head-all{
    display: flex;
    flex-wrap: nowrap;
    /* justify-content: space-around; */
    flex-direction: row;
    background-color: rgb(100, 100, 100);
    color: white;
    /* margin-bottom: 10px; */
    border-radius: 10px 10px 0 0;
}

.table-body-all{
    display: flex;
    flex-wrap: nowrap;
    /* justify-content: space-around; */
    flex-direction: row;
    border-top: 1px solid #989898;
    background-color: #f2f2f2;
    color: black;
    border-collapse: collapse;
    /* margin: 10px 20px; */
}


.head-single{
    /* border:1px solid #747373; */
    padding: 15px;
    font-size: 1.25rem;
    font-weight: 600;
    flex: 1;
    text-align: center;
}

.body-single{
    /* border:1px solid #747373; */
    padding: 10px 20px;
    align-items: center; /* Align items vertically */
    flex: 1;
    text-align: center;
}

.table-body-all:hover{
    /* border:1px solid #747373; */
    color: rgb(0, 0, 0);
    background-color: #d0d0d0;
    
}
</style>