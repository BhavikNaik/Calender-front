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
        <Teleport to="body" v-if="showT">
            <div class="maintoast">
                <CreateTask @close="closeToast" @create-event="handleFormSubmitted" />
            </div>
        </Teleport>
        <div v-if="isOpen" class="modal2">
            <div class="modal-content2">
                <div class="inner-modal-top">
                    <div>Task</div>
                    <div class="close" @click="closeModaledit">&times;</div>
                </div>
                <div class="inner-modal-content">
                    <div
                        style="text-align: center;margin:4px 2px;padding: 6px 0; font-size: 1.5rem; border-bottom: 1px solid beige;">
                        {{ selectEvent.title }}</div>
                    <div class="inner-modal">
                        <div class="modal-labels">Title: </div>
                        <!-- <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.description }}</div> -->
                        <div class="modfield2">
                            <input type="text" v-model="selectEvent.title" id="title">
                            <span class="fas fa-envelope"></span>
                        </div>
                    </div>
                    <div class="inner-modal">
                        <div class="modal-labels">Description: </div>
                        <!-- <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.description }}</div> -->
                        <div class="modfield2">
                            <input type="text" v-model="selectEvent.description" id="description">
                            <span class="fas fa-info-circle"></span>
                        </div>
                    </div>
                    <div class="inner-modal">
                        <div class="modal-labels">Date: </div>
                        <!-- <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.start }}</div> -->
                        <div class="modfield2">
                            <input type="date" v-model="selectEvent.startDate" id="start">
                            <span class="fas fa-calendar-alt"></span>
                        </div>
                    </div>
                    <div class="inner-modal">
                        <div class="modal-labels">Time: </div>
                        <!-- <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.start }}</div> -->
                        <div class="modfield2">
                            <input type="time" v-model="selectEvent.startTime" id="starti">
                            <span class="fas fa-clock"></span>
                        </div>
                    </div>
                    <div class="inner-modal">
                        <div class="modal-labels">Status: </div>
                        <div class="modfield2">
                            <select v-model="selectEvent.status" style="padding: 5px 10px; width: 100%;">
                                <option value="In-progress">In Progress</option>
                                <option value="Open">Open</option>
                                <option value="Waiting">Waiting</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div class="buttons" style="margin: 1em 0.5em;">
                        <button class="inner-buttons2" @click="editEvent(selectEvent._id)">Update</button>
                        <button class="inner-buttons2" @click="deleteEvent(selectEvent.id)">Delete</button>
                    </div>
                </div>
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
            <div class="main-container">
                <div class="app" :style="{ width: isCollapsed ? '70px' : '300px' }">
                    <button @click="toggleNavbar" class="nav-button">
                        <span v-if="!isCollapsed" class="fas fa-times"></span>
                        <span v-else class="fas fa-bars"></span>
                    </button>
                    <div :class="{ 'collapsed': isCollapsed }">
                        <div>
                            <div class="inner-links"><span class="fas fa-solid fa-calendar" style="margin-right: 1rem;"></span><span v-if="!isCollapsed">Home</span></div> 
                            <div class="inner-links"><span class="fas fa-solid fa-plus" style="margin-right: 1rem;"></span><span v-if="!isCollapsed" @click="showToast">Create Event</span></div>
                            <div class="inner-links" style="justify-content: space-between;">
                                <span>
                                    <span class="fas fa-solid fa-filter" style="margin-right: 1rem;"></span>
                                    <span v-if="!isCollapsed">Filters</span>
                                </span>
                                <button v-if="!isCollapsed" class="dropdown-toggle" @click="toggleDropdownFilter" style="background:none;cursor: pointer;border: none;outline: none;"><span class="fas fa-chevron-down"></span></button>
                            </div>
                            <div class="dropdown-content2" v-show="isDropdownOpen" v-if="!isCollapsed">
                                <div class="modfield3">
                                    <input type="text" id="phoneNumber" v-model="phoneNumber" placeholder="Search By Number..">
                                    <span class="fas fa-search"></span>
                                </div>
                                <div class="modfield3">
                                    <input type="date" v-model="startDate" id="startDate" @change="this.getTasks(this.startDate,this.endDate)">
                                    <span class="fas fa-clock"></span>
                                </div>
                                <div class="modfield3">
                                    <input type="date" v-model="endDate" id="endDate" @change="this.getTasks(this.startDate,this.endDate)">
                                    <span class="fas fa-clock"></span>
                                </div>
                            </div>
                            <div class="inner-links"><span class="fas fa-sign-out-alt" style="margin-right: 1rem;"></span><span v-if="!isCollapsed" @click="logout">Logout</span></div>
                            
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <div class="table">
                        <div class="table-head-all">
                            <div class="head-single">TITLE</div>
                            <div class="head-single">DATE</div>
                            <div class="head-single">TIME</div>
                            <div class="head-single">STATUS</div>
                            <div class="head-single">DESCRIPTION</div>
                            <div class="head-single">RELATED TO</div>
                            <!-- <div class="head-single">CONTACT NUMBER</div> -->
                        </div>
                        <div class="table-body-all" v-for="event in gettasks" :key="event._id" @click="onEventClick(event)">
                            <div class="body-single">{{ event.title }}</div>
                            <div class="body-single">{{ event.startDate }}</div>
                            <div class="body-single">{{ event.startTime }}</div>
                            <!-- <div class="body-single">{{ event.time }}</div> -->
                            <div class="body-single">{{ event.status }}</div>
                            <div class="body-single">{{ event.description }}</div>
                            <div class="body-single">{{ event.related_to }}</div>
                            <!-- <div class="body-single">{{ event.createrPhone }}</div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import CreateTask from './CreateTask.vue'
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    components: {
        CreateTask,
    },
    data() {
        return {
            isAuthenticated: false,
            showT: false,
            isLarge: true,
            userId: '',
            isOpen: false,
            selectEvent:[],
            gettasks: [],
            eventstarts: [],
            isOpenMod: false,
            isOpenRem: false,
            isCollapsed: false,
            isDropdownOpen: false,
            phoneNumber:'',
            startDate: '',
            endDate: '',
            status: '',
            todayDate: '',
            todayTime: '',
            startTimeError: '',
            titleError: '',
            tableData: [
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Alice', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
                { title: 'Bob', time: '2024-02-17 16:40', description: 'anything something random', status: 'completed'},
                { title: 'Random', time: '2024-02-17 14:40', description: 'anything but not something random', status: 'in-progress' },
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
            console.log("ye",userData); // This will contain information about the currently logged-in user
            this.userId = response.data._id;
            this.createrPhone = response.data.phone_no;
            //await this.getInvitations();
            if (!this.startDate || !this.endDate) {
                const today = new Date();
                // console.log(today); 
                const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().substring(0,10);
                const todayUTCTime = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(), today.getMinutes())).toISOString().substring(11,16);
                this.startDate = todayUTC;
                this.endDate = todayUTC;
                const parts = todayUTC.split('-');
                this.todayDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                this.todayTime = todayUTCTime;
            }
            await this.getTasks(this.startDate,this.endDate);
        } catch (error) {
            console.error("errrr",error);
        }
        
    },
    methods: {
        toggleDropdownRem() {
            this.isOpenRem = !this.isOpenRem;
            console.log(this.invitations);
        },
        toggleNavbar() {
            this.isCollapsed = !this.isCollapsed;
        },
        toggleDropdownFilter() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        validateTitle() {
            // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(this.title.length < 1) {
               //alert('Invalid email address');
               this.titleError=false;
            } else{
               this.titleError=true;
            }
         },
         validateStartDate() {
            if(this.startDate.length < 6) {
               //alert('Password must be at least 6 characters');
               this.startTimeError=false;
            } else{
               this.startTimeError=true;
            }
         },
         validateStartTime() {
            if(this.startTime.length < 4) {
               //alert('Password must be at least 6 characters');
               this.startTimeError=false;
            } else{
               this.startTimeError=true;
            }
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
        async getTasks(startDate, endDate){
            try {
                const response = await axios.get(`http://localhost:3000/api/get-tasks?startDate=${startDate}&endDate=${endDate}`, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.gettasks = [];

                userData.forEach(item => {
                    let datePart = item.dueDate.slice(0, 10);
                    let timePart = item.dueDate.slice(11, 16);
                    const parts = datePart.split('-');
                    let startDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    this.gettasks.push({
                        title: item.title,
                        description: item.description,
                        startDate: startDate,
                        startTime: timePart,
                        status: item.status,
                        related_to: item.related_to,
                        createrPhone: item.createrPhone,
                        _id: item._id,
                    });
                });
                // console.log("thid",this.invitestarts);

            } catch (error) {
                console.error("errrr",error);
            }
        },
        onEventClick(event) {
            this.selectEvent = event;
            // this.selectEvent.start = this.dateTimeChangeFormat(this.selectEvent.start);
            // this.selectEvent.end = this.dateTimeChangeFormat(this.selectEvent.end);
            console.log(this.selectEvent);
            let partss = this.selectEvent.startDate.split('-');
            this.selectEvent.startDate = `${partss[2]}-${partss[1]}-${partss[0]}`;

            this.isOpen = true;
        },
        closeModaledit() {
            //this.showDialog = false;
            this.isOpen = false;
            let partss = this.selectEvent.startDate.split('-');
            this.selectEvent.startDate = `${partss[2]}-${partss[1]}-${partss[0]}`;
            this.selectEvent = [];
        },
        openModal(invitation) {
            this.isOpenMod = true;
            this.selectedInvitation = invitation;
        },
        closeModal() {
            this.isOpenMod = false;
        },
        showToast() {
            this.showT = true;
        },
        closeToast() {
            this.showT = false;
        },
        handleFormSubmitted() {
            this.showT = false
            console.log("Submitted")
        },
        async editEvent(Id) {
            try {
                // this.validateTitle();
                // this.validateStartTime();

                // if (!this.titleError) {
                //     alert('Title cannot be Empty !!');
                //     return;
                // }
                // if (!this.startTimeError) {
                //     alert('Time should be mentioned');
                //     return;
                // }
                let combinedDateTime = new Date(`${this.selectEvent.startDate}T${this.selectEvent.startTime}:00`).toISOString();
                console.log(combinedDateTime)

                const response = await axios.post(`http://localhost:3000/api/editTask/${Id}`, {
                    title: this.selectEvent.title,
                    description: this.selectEvent.description,
                    dueDate: combinedDateTime,
                    status: this.selectEvent.status,
                    //related_to: this.selectEvent.related_to,
                }
                , { withCredentials: true });
                const userData = response.data;
                console.log("get wala", userData);
                this.triggerToast("Task Updated !!");
                this.closeModaledit();
            } catch (error) {
                console.error("errrr", error);
            }
        },
        async deleteEvent(Id) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/deleteTask/${Id}`, { withCredentials: true });
                const userData = response.data;
                console.log("deleted ye", userData);
                this.triggerToast("Event Deleted !!");
                // this.displayEvent();
                this.closeModaledit();
            } catch (error) {
                console.error("errrr", error);
            }
        },
    }
}
</script>

<style scoped>
.fullbgAg{
    background-color: linear-gradient(to right, #0026ff, #0040ff, #0751f1, #cecece);
    height: 100vh;
}

.main-container{
    display: flex;
    flex-direction: row;
    min-height: calc(100vh - 100px);
}

.app {
    max-width: 300px;
    width: 250px;
    max-height: calc(100vh - 100px);
    background-color: #e5e5e5;
    color: rgb(0, 0, 0);
    transition: width 0.2s ease-out;
    border-radius: 0 10px 10px 0;
    padding: 6px 8px;
    font-family: ‘Open Sans’, sans-serif;
}

.collapsed {
    width: 70px;
}

.nav-button {
    text-align: right;
    margin: 20px 8px 25px;
    font-size: 1.3rem;
    padding: 5px 8px;
}

.inner-links{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 14px 18px;
    font-size: 1.2rem;
    font-weight: 650;
}

.inner-links:hover{
    cursor: pointer;
    color: #d75858;
}
.table-container {
    max-height: calc(100vh - 100px);
    overflow-x: auto;
    width: 100%;
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

.table-head-all{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    background-color: rgb(100, 100, 100);
    color: white;
    border-radius: 10px 10px 0 0;
    border-bottom: 3px solid rgba(255, 255, 255);
}

.table-body-all{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    border-top: 1px solid #989898;
    background-color: #e5e5e5;
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
    flex-wrap: nowrap;
}

.body-single{
    /* border:1px solid #747373; */
    padding: 10px 20px;
    align-items: center;
    flex: 1;
    text-align: center;
}

.table-body-all:hover{
    /* border:1px solid #747373; */
    color: rgb(0, 0, 0);
    background-color: #d0d0d0;
    
}

.modfield3{
  height: 40px;
  max-width: 200px;
  /* min-width: 200px; */
  display: flex;
  position: relative;
  margin: 10px 20px;
  align-items: center;
}

.modfield3 input{
  height: 100%;
  width: 100%;
  padding-left: 3rem;
  padding-right: 20px;
  outline: none;
  border: none;
  font-size: 15px;
  background: #faf3f3;
  color: #595959;
  border-radius: 7px;
  box-shadow: inset 2px 2px 5px #f9efef,
              inset -5px -5px 10px #ffffff73;
}

.modfield3 span{
  position: absolute;
  color: #595959;
  line-height: 40px;
  margin-left: 10px;
}

#startDate:hover::after,
#endDate:hover::after {
  content: "Search by Start Date";
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: black;
  color: #f9f9f9; /* Background color */
  padding: 10px;
  border-radius: 5px;
  z-index: 1;
  font-size: 0.85rem;
  width: calc(100% - 20px);
}

#endDate:hover::after{
    content: "Search by End Date";
}
</style>