<template>
    <div class="fullbgAg">
        <div class="nav">
            <h2 style="display: flex;flex-wrap: nowrap;"><span class="fas fa-solid fa-calendar" style="margin-right: 8px;"></span>Calendar</h2>
            <!-- <span class="fas fa-sharp fa-regular fa-list" style="margin-right: 8px;"></span> -->
            <div class="navright">
                <div class="dropdown-rem">
                    <button @click="toggleDropdownRem" class="reminder"><span class="fa fa-bell" style="font-size: 23px;padding: 8px 12px;color: aliceblue;"></span></button>
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
                    <div class="logout"><img src="http://localhost:5173/src/assets/logout.png" style="max-width:30px;max-height: 20px;padding: 0;"/></div>
                </button>
            </div>
        </div>
        <div>
            <div class="main-container">
                <div class="app" :style="{ width: isCollapsed ? '70px' : '300px' }">
                    <button @click="toggleNavbar" class="nav-button">
                        <span v-if="!isCollapsed" class="fas fa-times"></span>
                        <span v-else class="fas fa-bars"></span>
                    </button>
                    <div :class="{ 'collapsed': isCollapsed }">
                        <div>
                            <div class="inner-links" @click="selectContent('home')"><span class="fas fa-solid fa-calendar" style="margin-right: 1rem;"></span><span v-if="!isCollapsed">Home</span></div> 
                            <!-- <div class="inner-links"><span class="fas fa-solid fa-plus" style="margin-right: 1rem;"></span><span v-if="!isCollapsed" @click="showToast">Create Event</span></div> -->
                            <div class="inner-links" style="justify-content: space-between;" v-if="selectedContent === 'home'">
                                <span>
                                    <span class="fas fa-solid fa-filter" style="margin-right: 1rem;"></span>
                                    <span v-if="!isCollapsed">Filters</span>
                                </span>
                                <button v-if="!isCollapsed" class="dropdown-toggle" @click="toggleDropdownFilter" style="background:none;cursor: pointer;border: none;outline: none;"><span class="fas fa-chevron-down"></span></button>
                            </div>
                            <div class="dropdown-content2" v-show="isDropdownOpen" v-if="!isCollapsed && selectedContent === 'home'">
                                <div class="modfield2">
                                    <input type="text" id="phoneNumber" v-model="phoneNumber" @change="this.getTasks(this.startDate,this.endDate, this.phoneNumber)" placeholder="Search By Number..">
                                    <span class="fas fa-search"></span>
                                </div>
                                <div class="modfield2">
                                    <input type="date" v-model="startDate" id="startDate" @change="this.getTasks(this.startDate,this.endDate)">
                                    <span class="fas fa-clock"></span>
                                </div>
                                <div class="modfield2">
                                    <input type="date" v-model="endDate" id="endDate" @change="this.getTasks(this.startDate,this.endDate)">
                                    <span class="fas fa-clock"></span>
                                </div>
                            </div>
                            <div class="inner-links" @click="selectContent('dept')"><span class="fas fa-solid fa-heading" style="margin-right: 1rem;"></span><span v-if="!isCollapsed">Services</span></div> 
                            <div class="inner-links" @click="selectContent('doc')"><span class="fas fa-solid fa-user" style="margin-right: 1rem;"></span><span v-if="!isCollapsed">Resources</span></div> 
                            <div class="inner-links"><span class="fas fa-sign-out-alt" style="margin-right: 1rem;"></span><span v-if="!isCollapsed" @click="logout">Logout</span></div>
                            
                        </div>
                    </div>
                </div>
                <div class="table-container" v-if="selectedContent == 'home'">
                    <div class="table">
                        <div class="table-head-all">
                            <div class="head-single">DATE</div>
                            <div class="head-single">TIME</div>
                            <div class="head-single">TITLE</div>
                            <div class="head-single">DESCRIPTION</div>
                            <div class="head-single">STATUS</div>
                            <div class="head-single">CUSTOMER</div>
                            <div class="head-single">SERVICE</div>
                            <div class="head-single">RESOURCE</div>
                            <div class="head-single">AGENT</div>
                        </div>
                        <div class="table-body-all" v-for="event in gettasks" :key="event.id">
                            <div class="body-single">{{ event.startDate }}</div>
                            <div class="body-single">{{ event.startTime }} - {{ event.endTime }}</div>
                            <div class="body-single">{{ event.title }}</div>
                            <!-- <div class="body-single">{{ event.time }}</div> -->
                            <div class="body-single">{{ event.description }}</div>
                            <div class="body-single">{{ event.status }}</div>
                            <div class="body-single">{{ event.related_to }}</div>
                            <div class="body-single">{{ event.service }}</div>
                            <div class="body-single">{{ event.resource }}</div>
                            <span class="body-single" id="hoverAgent">{{ event.creatorName }}</span>
                            <!-- @mouseover="showAgent(event)" @mouseleave="hideAgent(event)"-->
                            <!-- <span v-if="hoveredEvents === event.id" id="agentDetails">{{ event.creatorPhone }},<br> {{ event.creatorMail }}</span>  -->
                        </div>
                    </div>
                </div>
                <div v-else-if="selectedContent === 'dept'" class="table-container">
                    <DeptVue />
                </div>
                <div v-else-if="selectedContent === 'doc'" class="table-container">
                    <DoctorVue />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import CreateTask from './CreateTask.vue'
import DeptVue from './DeptVue.vue';
import DoctorVue from './DoctorVue.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    components: {
        CreateTask,
        DeptVue,
        DoctorVue
    },
    data() {
        return {
            isAuthenticated: false,
            showT: false,
            isLarge: true,
            userId: '',
            isOpen: false,
            gettasks: [],
            eventstarts: [],
            isOpenMod: false,
            isOpenRem: false,
            isCollapsed: false,
            isDropdownOpen: false,
            phoneNumber:'',
            startDate: '',
            endDate: '',
            isHovered: false,
            hoveredEvents:'',
            Id: '',
            selectedContent:'home',
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
            //await this.getInvitations();
            if (!this.startDate || !this.endDate) {
                const today = new Date();
                const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().substring(0,10);
                console.log(todayUTC);
                this.startDate = todayUTC;
                this.endDate = todayUTC;
            }
            await this.getTasks(this.startDate, this.endDate, this.phoneNumber);
        } catch (error) {
            console.error("errrr",error);
        }
        
    },
    methods: {
        toggleDropdownRem() {
            this.isOpenRem = !this.isOpenRem;
            //console.log(this.invitations);
        },
        selectContent(content) {
            this.selectedContent = content;
        },
        toggleNavbar() {
            this.isCollapsed = !this.isCollapsed;
        },
        toggleDropdownFilter() {
            this.isDropdownOpen = !this.isDropdownOpen;
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
        showAgent(e) {
            //this.hoverContent = `Mail: ${e}.mail}, Name: ${data.name}`;
           // this.isHovered = true;
           //this.hoveredEvents[e.id]=true;
           this.hoveredEvents = e.id;
           this.Id = e.id;
        },
        hideAgent(e){
            //this.isHovered = false;
            //this.$set(this.hoveredEvents, e.id, false);
            this.hoveredEvents = '';
            this.Id = '';
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
        async getTasks(startDate, endDate, no=''){
            try {
                let url = `http://localhost:3000/api/get-bookings/?startDate=${startDate}&endDate=${endDate}`;
                if(no != ''){
                    url += `&phone_no=${no}`;
                }
                const response = await axios.get(url, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.gettasks = [];

                userData.forEach(item => {
                    let datePart = item.startDate.slice(0, 10);
                    let starttimePart = item.startDate.slice(11, 16);
                    let endtimePart = item.endDate.slice(11,16);
                    const parts = datePart.split('-');
                    let startDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

                    this.gettasks.push({
                        title: item.title,
                        description: item.description,
                        startDate: startDate,
                        startTime: starttimePart,
                        endTime: endtimePart,
                        status: item.status,
                        related_to: item.related_to,
                        creatorName: item.creatorName,
                        service: item.service,
                        resource: item.resource,
                        customerId: item.customerId,
                        id: item._id,
                    });
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
            this.showT = true;
        },
        closeToast() {
            this.showT = false;
        },
        handleFormSubmitted() {
            this.showT = false
            console.log("Submitted")
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
    max-width: 235px;
    width: 220px;
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

.dropdown-content {
  display: flex;
  flex-direction: column;
  /* position: absolute; */
  background-color: #f9f9f9;
  min-width: 200px;
  padding: 10px;
  z-index: 1;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

/* .dropdown-content.show {
  display: block;
} */

.filter-option {
  margin-bottom: 10px;
}

.table-container {
    max-height: calc(100vh - 100px);
    min-height: calc(100vh - 100px);
    overflow-x: auto;
    width: 100%;
    /* background-color: linear-gradient(to right, #0026ff, #0040ff, #0751f1, #cecece); */
}

.table{
    /* border: 1px solid #747373; */
    margin: 0 10px;
    min-width: 1280px; 
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
    border-top: 1px solid rgb(196, 196, 196);
    background-color: #e5e5e5;
    color: black;
    border-collapse: collapse;
    /* margin: 10px 20px; */
}

.head-single{
    border-right:1px solid #000000; 
    padding: 15px;
    font-size: 1.25rem;
    font-weight: 600;
    flex: 2 2;
    text-align: center;
    flex-wrap: nowrap;
}
.head-single:nth-child(4){
    flex: 3 3;
    padding: 15px 5px;
}
/* .head-single:nth-child(2){
    flex: 1 1;
} */
.body-single{
    /* border:1px solid #747373; */
    padding: 10px 15px;
    align-items: center;
    flex: 2 2;
    text-align: center;
    max-height: 52px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: max-height 0.3s ease;
}

.body-single:nth-child(4) {
    flex: 3 3;
    padding: 10px 5px;
}

/* .body-single:nth-child(2) {
    flex: 1 1;
} */

.body-single:hover{
    max-height: none;
    overflow: auto;
    white-space: wrap;
}

.table-body-all:hover{
    /* border:1px solid #747373; */
    color: rgb(0, 0, 0);
    background-color: #d0d0d0;
    
}

.modfield2{
  height: 40px;
  max-width: 200px;
  /* min-width: 200px; */
  display: flex;
  position: relative;
  margin: 10px 20px;
  align-items: center;
}

.modfield2 input{
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

.modfield2 span{
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
  text-align: center;
}

#endDate:hover::after{
    content: "Search by End Date";
}

/* #agentDetails{
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    margin: 10px 20px;
    background-color: black; 
    z-index: 1;
} */

#hoverAgent:hover + #agentDetails::after{
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
  text-align: center;
}
</style>