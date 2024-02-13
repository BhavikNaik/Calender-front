<template>
    <div>
        <div class="nav">
            <h2 style="display: flex;flex-wrap: nowrap;"><span  class="fas fa-solid fa-calendar" style="margin-right: 8px;"></span>Calender</h2>
            <!-- <span class="fas fa-sharp fa-regular fa-list" style="margin-right: 8px;"></span> -->
            <div class="navright">
                <button class="createEvent" @click="getEvents">Get Events</button>
                <!-- <button class="createEvent" @click="ifAuth">Email</button> -->
                <button class="createEvent" @click="showToast">Create Event</button>
                <button @click="logout">
                <!-- <div v-show="!isLarge" class="createEvent">Logout</div> -->
                    <div class="logout"><img src="../assets/logout.png" style="max-width:30px;max-height: 20px;padding: 0;"/></div>
                </button>
            </div>
        </div>
        <Teleport to="body" v-if="showT">
            <div class="maintoast">
                <CreateEvent @close="closeToast" @create-event="handleFormSubmitted" />
            </div>
        </Teleport>
        <div class="calboth">
            <div class="leftCal">
                <VCalendar :attributes="attrs" is-dark="{}" class="cal"/>
                <div class="dropdown">
                    <div style="display: flex;justify-content: space-between; padding: 5px 10px;font-size: 1.2rem;">
                        <div>Invitations</div>
                        <div><button @click="toggleDropdown">V</button></div>
                    </div>
                    <!-- <div v-if="isOpen" class="dropdown-content"> -->
                    <div class="inner-scroll">
                        <div v-if="isOpen" v-for="invitation in invitations" class="dropdown-content" v-on:click="handleSelect(invitation)">
                            <div class="inner-content">
                                <div>Title: {{invitation.title}}</div>
                                <div>Start Time: {{invitation.start}}</div>
                                <div>End Time: {{invitation.end}}</div>
                                <div>Invited by: {{invitation.host}}</div>
                                <div class="buttons">
                                    <button class="inner-buttons" @click="submitYes(invitation.id)">Yes</button>
                                    <button class="inner-buttons" @click="submitNo(invitation.id)">No</button>
                                    <button class="inner-buttons" @click="submitMaybe(invitation.id)">Maybe</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Calender class="calendar" v-if="renderComponent"/>
        </div>
    </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import CreateEvent from './CreateEvent.vue'
import Calender from "./Calender.vue";
import { nextTick, ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    components: {
        CreateEvent,
        Calender
    },
    // setup() {
    //     const toast = useToast();
    //     return { toast }
    // },
    data() {
        return {
            isAuthenticated: false,
            showT: false,
            isLarge: true,
            userId: '',
            isOpen: false,
            invitations: [],
            eventstarts: [],
            attrs: [],
            selectItem:'',
            renderComponent: true,
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
            await this.getInvitations();
            await this.getEvents();
            this.attrs = [
            {
                key: 'today',
                highlight: true,
                dates: new Date(),
            },
            {
                dot: 'red',
                dates: this.eventstarts.map(invitation => invitation.start)
            }];
            // console.log("as",this.invitestarts);
            // console.log("ye",JSON.parse(JSON.stringify(this.invitestarts)));
            // console.log("as",this.attrs);
            // console.log(this.userId);
        } catch (error) {
            console.error("errrr",error);
        }

            // // Remove MyComponent from the DOM
            // this.renderComponent = false;

            // // Then, wait for the change to get flushed to the DOM
            // await this.$nextTick();

            // // Add MyComponent back in
            // this.renderComponent = true;
        
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        handleSelect(invitation) {
            // console.log(invitation);
            this.selectItem = invitation.id;
            console.log(this.selectItem);
        },
        async logout() {
            // await axios.post('http://localhost:3000/logout', { withCredentials: true })
            //     .then((response) => {
            //         // this.$cookies.remove('email');
            //         console.log(response.data);
            //         this.$router.push('/login')
            //     }).catch((e) => {
            //         console.log("hi",e,"hi")
            //     })
            try {
                const response = await axios.post('http://localhost:3000/auth/logout', null, {  withCredentials: true });
                const userData = response.data;
                console.log(userData);
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
        async getEvents(){
            try {
                const response = await axios.get(`http://localhost:3000/api/get-events`, {  withCredentials: true });
                const userData = response.data;
                console.log(userData);
                userData.forEach(item => {
                    // Push each item into the events array
                    let datePart = item.startDate.slice(0, 10);
                    let timePart = item.startDate.slice(11, 16);
                    let dateTimeString = `${datePart} ${timePart}`;
                    this.stime = dateTimeString;

                    this.eventstarts.push({
                        start: this.stime.slice(0,10),
                    });
                });

            } catch (error) {
                console.error("errrr",error);
            }
        },
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
                        start: this.stime,
                        end: this.etime,
                        host: item.host,
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
        async submitYes(Id){
            try {
                const response = await axios.post(`http://localhost:3000/api/rsvp/${Id}`, {status:"accept"}, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.getInvitations();
            } catch (error) {
                console.error("errrr",error);
            }
        },
        async submitNo(Id){
            try {
                const response = await axios.post(`http://localhost:3000/api/rsvp/${Id}`, {status:"decline"}, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.getInvitations();
            } catch (error) {
                console.error("errrr",error);
            }
        },
        async submitMaybe(Id){
            try {
                const response = await axios.post(`http://localhost:3000/api/rsvp/${Id}`, {status:"maybe"}, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.getInvitations();
            } catch (error) {
                console.error("errrr",error);
            }
        },
        // getEmail(){
        //     this.cookieEmail = this.$cookies.get('email');
        //     console.log("home pe", this.cookieEmail)
        // },
        // triggerToast() {
        //     this.toast("Hi from LogRocket", {
        //         position: "top-center",
        //         closeOnClick: true,
        //         draggable: true,
        //         draggablePercent: 0.6,
        //         showCloseButtonOnHover: false,
        //         closeButton: "button",
        //         icon: "fas fa-rocket",
        //     });
        // }
        showToast() {
            this.showT = true
        },
        closeToast() {
            this.showT = false
        },
        handleFormSubmitted() {
            this.showT = false
            console.log("Submitted")
            // const response = await axios.post('http://localhost:3000/logout', {
            //         email: this.mail,
            //         ename: this.ename,
            //         desc: this.desc,
            //         startTime: this.startTime,
            //         endTime: this.endTime,
            //    })
            //     .then(() => {
            //         // this.$router.push('/login')
            //     }).catch((e) => {
            //         console.log(response)
            //         console.log(e)
            //     })
            // 
        },
    }
}
</script>

<style>
.maintoast {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    /* max-width: 310px; */
    padding: 10px 0;
    background: #dde1e7;
    box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999; 
}

.nav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 1.2rem;
    background: #2e7ef5;
    margin-bottom: 1rem;
    color: #000000;
    box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288);
}
.navright{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px;
    /* box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288); */
}

.cal .vc-title{
    background-color: #000000;
    color: #e9eaf0;
}

.leftCal{
    display: flex;
    /* justify-content: center;
    align-items: center; */
    flex-direction: column;
}

.createEvent{
    margin: 0 10px;
  max-width: 450px;
  padding: 10px 16px;
  font-size: 1.1rem;
  font-weight: 500;
  background: #000000;
  border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  color: #e9eaf0;
}

.logout{
    margin: 0;
    padding: 7px 7px 5px;
    background: #000000;
    border: none;
    outline: none;
    box-shadow: 4px 4px 8px rgba(24, 34, 50, 0.288),0px 0px 2px #ffffff73;
}

.calboth{
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-; */
    /* align-items: center; */
}

.calendar {
  flex: 1;
  margin: 0 25px;
  max-height: 640px;
}

.topi {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.norText{
    padding-top: 10px;
    font-weight: 500;
    font-size: 1.3rem;
    text-align: left;
    color: #5096ff;
    text-shadow: 1px 1px 2px beige;
}

.closeSymbol{
    font-weight: 500;
    font-size: 1.3rem;
    width: 40px;
    border: none;
    position: absolute;
    top: 10px;
    right: 0;
    color: #dde1e7;
    background-color: #00000000;
}

.modsubmit{
    display: flex;
    margin: 10px auto;
    padding: 8px 20px;
    color: #000000;
    font-weight: 700;
    background-color: rgba(22, 71, 231, 0.918);
    border: none;
    font-size: 1.2rem;
    text-align: center;
    text-shadow: 0.5px 0 1px beige;
}

.modfield{
  height: 50px;
  width: 100%;
  min-width: 270px;
  display: flex;
  position: relative;
  margin: 15px 0 25px 0;
}

.modfield input{
  height: 100%;
  width: 100%;
  padding-left: 3rem;
  outline: none;
  border: none;
  font-size: 15px;
  background: #faf3f3;
  color: #595959;
  border-radius: 7px;
  box-shadow: inset 2px 2px 5px #f9efef,
              inset -5px -5px 10px #ffffff73;
}

.modfield span{
  position: absolute;
  color: #595959;
  line-height: 50px;
  margin-left: 15px;
}
.cal{
    margin-left: 20px;
    min-width: 300px;
}

.dropdown {
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  max-width: 300px;
  margin-left: 20px;
  margin-top: 10px;
}

.inner-scroll{
    max-height: 320px;
  overflow-y: auto;

}

.dropdown-content {
  display: flex;
  flex-direction: row;
  /* position: absolute; */
  background-color: #e7e6e6;
  min-width: 150px;
  max-height: 200px; /* Set maximum height */
  /* overflow-y: auto; Enable vertical scrollbar */
  z-index: 1;
}

.inner-content {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 2px solid #3f0a0a;
}
.buttons{
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
}

.inner-buttons {
    padding: 4px 7px;
    background-color: #0066ff;
    color: white;
}

/* .dropdown-content button {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background-color: transparent;
  cursor: pointer;
} */

/* .dropdown-content button:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
} */

</style>