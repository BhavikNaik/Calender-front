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
        <div v-if="isOpenMod" class="modal">
            <div class="modal-content">
                <div class="inner-modal-top"><div>Invitation</div><div class="close" @click="closeModal">&times;</div></div>
                <div class="inner-modal-content">
                    <div style="text-align: center;margin:4px 2px;padding: 6px 0; font-size: 1.5rem; border-bottom: 1px solid beige;">{{ selectedInvitation.title }}</div>
                    <div class="inner-modal"><div class="modal-labels">Description: </div><div class="modal-value">{{ selectedInvitation.description }}</div></div>
                    <div class="inner-modal"><span class="modal-labels">Start Time: </span><span class="modal-value">{{ selectedInvitation.start }}</span></div>
                    <div class="inner-modal"><span class="modal-labels">End Time: </span><span class="modal-value">{{ selectedInvitation.end }}</span></div>
                    <div class="inner-modal"><div class="modal-labels">Invited by:</div><div class="modal-value">{{ selectedInvitation.hostEmail }}</div></div>
                    <div class="buttons" style="margin: 1em 0.5em;">
                        <button class="inner-buttons2" @click="submitYes(selectedInvitation.id)">Yes</button>
                        <button class="inner-buttons2" @click="submitNo(selectedInvitation.id)">No</button>
                        <button class="inner-buttons2" @click="submitMaybe(selectedInvitation.id)">Maybe</button>
                    </div>
                </div>

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
                    <div style="display: flex;justify-content: space-between; padding: 5px 10px;font-size: 1.2rem; border-bottom: 1px solid black;min-width: 200px;">
                        <div>Invitations</div>
                        <div><button @click="toggleDropdown">V</button></div>
                    </div>
                    <!-- <div v-if="isOpen" class="dropdown-content"> -->
                    
                    <div class="inner-scroll">
                        <div v-if="isOpen" v-for="invitation in invitations" class="dropdown-content" v-on:click="openModal(invitation)">
                            <div class="inner-content">
                                <div>Title: {{invitation.title}}</div>
                                <div>Time: {{invitation.start}} - {{invitation.end}}</div>
                                <div>Invited by: {{invitation.hostEmail}}</div>
                                <div class="buttons">
                                    <button class="inner-buttons" @click="submitYes(invitation.id)">Yes</button>
                                    <button class="inner-buttons" @click="submitNo(invitation.id)">No</button>
                                    <button class="inner-buttons" @click="submitMaybe(invitation.id)">Maybe</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Calender />
        </div>
    </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import CreateEvent from './CreateEvent.vue'
import Calender from "./Calender.vue";
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    components: {
        CreateEvent,
        Calender
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
            attrs: [],
            selectItem:'',
            renderComponent: true,
            isOpenMod: false,
            isOpenRem: false,
            selectedInvitation: null,
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
            await this.smallCalendar();
            // await this.$ref.calUpdate.displayEvent();
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
            console.log(this.invitations);
        },
        toggleDropdownRem() {
            this.isOpenRem = !this.isOpenRem;
            console.log(this.invitations);
        },
        handleSelect(invitation) {
            // console.log(invitation);
            this.selectItem = invitation.id;
            console.log(this.selectItem);
        },
        smallCalendar() {
            this.attrs = [
                {
                    key: 'today',
                    highlight: true,
                    dates: new Date(),
                },
                {
                    dot: 'red',
                    dates: this.eventstarts.map(invitation => invitation.start)
                }
            ];
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
        async getEvents(){
            try {
                const response = await axios.get(`http://localhost:3000/api/get-events`, {  withCredentials: true });
                const eventsAttending = response.data.eventsAttending;
                const maybeAttending = response.data.maybeAttending;

                const userData = eventsAttending.concat(maybeAttending);
                //const userData = response.data;
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
                this.smallCalendar();

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
        async submitYes(Id){
            try {
                const response = await axios.post(`http://localhost:3000/api/rsvp/${Id}`, {status:"accept"}, {  withCredentials: true });
                const userData = response.data;
                console.log(userData); 
                this.getInvitations();
                this.smallCalendar();
                this.triggerToast('Invite Accepted !!');
                //this.$ref.calUpdate.displayEvent();
                this.isOpenMod = false;
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
                this.triggerToast('Invite Declined !!');
                this.isOpenMod = false;
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
                this.smallCalendar();
                this.triggerToast('Maybe Attending !!');
                //this.$ref.calUpdate.displayEvent();
                this.isOpenMod = false;
            } catch (error) {
                console.error("errrr",error);
            }
        },
        // getEmail(){
        //     this.cookieEmail = this.$cookies.get('email');
        //     console.log("home pe", this.cookieEmail)
        // },
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

.fullbg{
    background-color: linear-gradient(to right, #d9d8d8, #ffffff, #ffffff, #cecece);
    height: 100vh;
}
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
    z-index: 10; 
}

.nav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 1.2rem;
    background: #2e7ef5;
    margin-bottom: 1rem;
    color: #000000;
    overflow: hidden;
    box-shadow: -3px -3px 7px #ffffff73,
               2px 2px 5px rgba(94,104,121,0.288);
    max-height: 70px;
}
.navright{
    display: flex;
    justify-content: flex-end;
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
    margin: 0 0 0 10px;
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

.reminder{
    border-radius: 5px;
  border: none;
  outline: none;
  cursor: pointer;
  /* text-align: center; */
  background: #000000;
  margin-right: 15px;
  margin-bottom: 9px;
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
  margin: 0 2%;
  max-height: 640px;
}

.topi {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.norText{
    padding-top: 10px;
    font-weight: 600;
    font-size: 1.4rem;
    text-align: left;
    color: #d5e6ff;
    text-shadow: 1px 1px 2px rgb(77, 76, 76);
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
    margin: 15px auto;
    padding: 8px 20px;
    color: #ffffff;
    font-weight: 500;
    background-color: rgba(22, 71, 231, 0.918);
    border: none;
    font-size: 1.2rem;
    text-align: center;
    text-shadow: 0.5px 0 1px beige;
}

.modfieldT{
  height: 80px;
  width: 100%;
  min-width: 270px;
  display: flex;
  /* justify-content: center; */
  flex-direction: column;
  align-items: center;
  /* position: relative; */
  margin: 10px 0 10px 0;
}

.modfieldT textarea{
    flex: 1;
  height: 100%;
  width: 100%;
  padding: 0.6rem 1rem ;
  outline: none;
  border: none;
  font-size: 15px;
  background: #faf3f3;
  color: #595959;
  border-radius: 7px;
  box-shadow: inset 2px 2px 5px #f9efef,
              inset -5px -5px 10px #ffffff73;
}

.modfield{
  height: 35px;
  width: 100%;
  min-width: 270px;
  display: flex;
  position: relative;
  margin: 15px 0 20px 0;
  align-items: center;
}

.modfield input{
  height: 100%;
  width: 100%;
  padding-left: 3rem;
  outline: none;
  border: none;
  font-size: 14px;
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

.modfield2{
  height: 30px;
  width: 100%;
  max-width: 260px;
  align-self: flex-end;
  position: relative;
  /* margin: 15px 0 25px 0; */
}

.modfield2 input{
  height: 100%;
  width: 100%;
  padding-left: 2.5rem;
  /* outline: none; */
  border: none;
  font-size: 12px;
  background: #faf3f3;
  color: #595959;
  border-radius: 7px;
  box-shadow: inset 2px 2px 5px #f9efef,
              inset -5px -5px 10px #ffffff73;
}

.modfield select{
  height: 100%;
  width: 100%;
  padding-left: 2.5rem;
  /* outline: none; */
  border: none;
  font-size: 12px;
  background: #faf3f3;
  color: #595959;
  border-radius: 7px;
  box-shadow: inset 2px 2px 5px #f9efef,
              inset -5px -5px 10px #ffffff73;
}
.inside-options {
    padding-left: 5rem;
    font-size: 1rem;
    background: #faf3f3;
    color: #595959;
    border-radius: 7px;
    box-shadow: inset 2px 2px 5px #f9efef, inset -5px -5px 10px #ffffff73;
}

/* .inside-options:checked {
    padding-left: 2rem;
} */
.modfield2 span{
  position: absolute;
  left: 10px;
  color: #595959;
  line-height: 30px;
}
.cal{
    margin-left: 20px;
    min-width: 300px;
}

.dropdown {
  display: flex;
  flex-direction: column;
  /* border: 2px solid black; */
  max-width: 300px;
  margin-left: 20px;
  margin-top: 10px;
}

.dropdown-rem {
  display: flex;
  flex-direction: column;
  /* border: 2px solid black; */
  /* text-align: right; */
  max-width: 300px;
  margin-left: 20px;
  margin-top: 10px;
}

.dropdown-content-rem {
    display: flex;
  flex-direction: row;
  max-height: 200px;
  /* position: absolute;
  top: 70px;
    right: 0; */
  background-color: #232323;
  color: white;
  min-width: 100px;
  max-width: 300px;
  margin-right: 20px;
  box-shadow: 0px 8px 16px 0px rgba(255, 255, 255, 0.2);
}

.inner-scroll{
    max-height: 220px;
  overflow-y: auto;
}
.inner-scrol{
    max-height: 220px;
  overflow-y: auto;
  position: absolute;
  top: 70px;
    right: 0;
    z-index: 11;
  /* padding: 5px 10px;
  background-color: #c4c4c4; */

}

.dropdown-content {
  display: flex;
  flex-direction: row;
  background-color: #e7e6e6;
  min-width: 150px;
  max-height: 200px;
  z-index: 1;
  font-size: 0.85rem;
}

.inner-content {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 2px solid #3f0a0a;
}
.buttons{
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}

.inner-buttons {
    padding: 4px 7px;
    background-color: #000000;
    color: white;
}
.inner-buttons2 {
    padding: 7px 14px;
    background-color: #000000;
    color: white;
    font-size: 1.1rem;
}

.modal {
  display: block;
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  background-color: #ffeae3;
  margin: 10% auto;
  z-index: 4;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.inner-modal-top{
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    border-bottom: 1px solid grey;
    color: #595959;
    z-index: 5;
}

.inner-modal-content{
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    padding: 5px 10px;
  background-color: #c4c4c4;
  z-index: 5;
    /* align-items: center; */
}
.modal-labels{
    /* max-width: 20%; */
    font-size: 1.2rem;
    font: "Helvetica",sans-serif;
    font-weight: bold;
  margin-right: 10px;
  width: 120px;
  /* min-width:80px; */
  color: #000000;
  text-shadow: 1px 1px 1px #ffffff;
}
.modal-value {
  flex: 1;
  margin-left: 5px;
  max-width: 260px;
  align-self: flex-end;
  color: #566afe;
  text-shadow: 1px 1px 1px #000000;
  font-size: 1.1rem;
  margin-right: 10px;
  word-wrap: break-word;
    overflow-wrap: break-word;
  /* text-align: left; */
}

.inner-modal{
    font-size: 1.2rem;
    padding: 5px 15px;
    text-shadow: 1px 1px 1px white;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    /* justify-content: flex-end; */
}

@media (max-width: 500px) {
  .inner-modal {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-labels {
    width: auto;
    margin-bottom: 5px;
  }

  .modal-value {
    margin-right: 10px;
    max-width: 220px;
    align-self: flex-start;
    margin-left: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

@media (max-width: 1000px) {
.leftCal{
    margin: 0 auto;
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
}
}

@media (max-width: 650px) {
.leftCal{
    margin: 0 auto;
    width: 100%;
    flex-direction: column;
}
}

.close {
  color: #2a2525;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,.close:focus {
  color: rgb(133, 131, 131);
}

</style>