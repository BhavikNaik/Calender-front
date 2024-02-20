<template>
    <div v-if="isOpenMod" class="modal2">
        <div class="modal-content2">
            <div class="inner-modal-top">
                <div>Event</div>
                <div class="close" @click="closeModal">&times;</div>
            </div>
            <div class="inner-modal-content">
                <div
                    style="text-align: center;margin:4px 2px;padding: 6px 0; font-size: 1.5rem; border-bottom: 1px solid beige;">
                    {{ selectEvent.title }}</div>
                <div class="inner-modal">
                    <div class="modal-labels">Description: </div>
                    <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.description }}</div>
                    <div v-else class="modfield2">
                        <input type="text" v-model="selectEvent.description" id="description">
                        <span class="fas fa-envelope"></span>
                    </div>
                </div>
                <div class="inner-modal">
                    <div class="modal-labels">Start Time: </div>
                    <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.start }}</div>
                    <div v-else class="modfield2">
                        <input type="datetime-local" v-model="selectEvent.start" id="start">
                        <span class="fas fa-calendar-alt"></span>
                    </div>
                </div>
                <div class="inner-modal">
                    <div class="modal-labels">End Time: </div>
                    <div class="modal-value" v-if="selectEvent.host !== userId">{{ selectEvent.end }}</div>
                    <div v-else class="modfield2">
                        <input type="datetime-local" v-model="selectEvent.end" id="end">
                        <span class="fas fa-calendar-alt"></span>
                    </div>

                </div>
                <div class="inner-modal" v-if="selectEvent.host === userId">
                    <div class="modal-labels">Add Invites:</div>
                    <div class="modfield2">
                        <input type="text" v-model="addInv" id="addInvites">
                        <span class="fas fa-envelope"></span>
                    </div>
                </div>
                <div class="inner-modal" v-if="selectEvent.host === userId">
                    <div class="modal-labels">Remove Invites:</div>
                    <div class="modfield2">
                        <input type="text" v-model="remInv" id="remInvites">
                        <span class="fas fa-envelope"></span>
                    </div>
                </div>
                <div class="inner-modal" v-if="selectEvent.host !== userId">
                    <div class="modal-labels">Invited by:</div>
                    <div class="modal-value">{{ selectEvent.hostEmail }}</div>
                </div>
                <div class="buttons" style="margin: 1em 0.5em;" v-show="selectEvent.host === userId">
                    <button class="inner-buttons2" @click="editEvent(selectEvent.id)">Update</button>
                    <button class="inner-buttons2" @click="deleteEvent(selectEvent.id)">Delete</button>
                </div>
            </div>
        </div>
    </div>
    
    <VueCal class="calendar" :disable-views="['years', 'year', 'month']" :on-event-click="onEventClick" :events="events"/>
    <!-- :time-from="8 * 60" 
    :time-to="20 * 60" -->
    <!-- style="max-height: 750px;min-width: 100%" -->
    <!-- <VDatePicker /> -->
    <!-- </div> -->
</template>

<script>
import axios from 'axios';
import VueCal from 'vue-cal';
import { useToast } from 'vue-toastification';

export default {
    components: {
        VueCal,
    },
    data() {
        return {
            date: new Date(),
            events: [],
            userId: '',
            stime: '',
            etime: '',
            description: '',
            host: '',
            id: '',
            selectEvent: [],
            isOpenMod: false,
            addInv:'',
            remInv: '',
            invMails: [],
            remMails: [],
            titleError: '',
            startTimeError: '',
            endTimeError: '',
            ownmail: '',
            showDialog: false,
        }
    },
    async mounted() {
        try {
            const response = await axios.get('http://localhost:3000/api/home', { withCredentials: true });
            // const userData = response.data;
            // console.log(userData); // This will contain information about the currently logged-in user
            this.userId = response.data.id;
            this.ownmail = response.data.email;
            //console.log("console chal rha",this.userId); 
            this.displayEvent();
            // console.log(this.userId);
        } catch (error) {
            console.error("errrr", error);
        }
    },
    methods: {
        validateTitle() {
            // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(this.selectEvent.title.length < 1) {
               //alert('Invalid email address');
               this.titleError=false;
            } else{
               this.titleError=true;
            }
         },
         validateStartTime() {
            if(this.selectEvent.start.length < 6) {
               //alert('Password must be at least 6 characters');
               this.startTimeError=false;
            } else{
               this.startTimeError=true;
            }
         },
         validateEndTime() {
            if(this.selectEvent.end.length < 6) {
               //alert('Password must be at least 6 characters');
               this.endTimeError=false;
            } else{
               this.endTimeError=true;
            }
         },
        addEmail(mailsInput,mails) {
            // Trim the input value and split it by commas to get multiple email addresses
            const newEmails = mailsInput.trim().split(',');
            
            // Loop through the new email addresses and add them to the existing array
            newEmails.forEach(email => {
                const trimmedEmail = email.trim();
                if (trimmedEmail && trimmedEmail != this.ownmail) {
                    mails.push(trimmedEmail);
                }
            });
            
            // Clear the input field
            mailsInput = '';
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
        // addEvent() {
        //     this.events.push({
        //         title: 'New Event',
        //         start: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 10, 30),
        //         end: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 12, 30),
        //     });
        // },
        async displayEvent() {
            try {
                const response = await axios.get('http://localhost:3000/api/get-events', { withCredentials: true });
                const eventsAttending = response.data.eventsAttending;
                const maybeAttending = response.data.maybeAttending;

                const userData = eventsAttending.concat(maybeAttending);
                //const userData = response.data;
                console.log("get wala", userData);
                this.events = [];

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

                    this.events.push({
                        title: item.title,
                        start: this.stime,
                        end: this.etime,
                        description: item.description,
                        host: item.host,
                        hostEmail: item.hostEmail,
                        id: item._id,
                    });
                });
            } catch (error) {
                console.error("errrr", error);
            }
        },
        dateTimeChangeFormat(datess){
            let dates = new Date(datess);
            dates.setHours(dates.getHours() + 5, dates.getMinutes() + 30);
            let datePart = dates.toISOString().slice(0, 10);
            let timePart = dates.toISOString().slice(11, 16);
            let dateTimeString = `${datePart} ${timePart}`;
            return dateTimeString;
        },

        onEventClick(event,e) {

            this.selectEvent = event;
            this.selectEvent.start = this.dateTimeChangeFormat(this.selectEvent.start);
            this.selectEvent.end = this.dateTimeChangeFormat(this.selectEvent.end);
            console.log(this.selectEvent);

            // let date = new Date(this.selectEvent.start);
            // date.setHours(date.getHours() + 5, date.getMinutes() + 30);
            // // let formattedDateTime = date.toISOString().slice(0, 16);
            // // this.selectEvent.start = formattedDateTime;
            // // formattedDateTime = date.toISOString().slice(0, 16);
            // // this.selectEvent.end = formattedDateTime;
            // let datePart = date.toISOString().slice(0, 10);
            // let timePart = date.toISOString().slice(11, 16);
            // let dateTimeString = `${datePart} ${timePart}`;
            // this.selectEvent.start = dateTimeString;

            // date = new Date(this.selectEvent.end);
            // date.setHours(date.getHours() + 5, date.getMinutes() + 30);
            // datePart = date.toISOString().slice(0, 10);
            // timePart = date.toISOString().slice(11, 16);
            // dateTimeString = `${datePart} ${timePart}`;
            // this.selectEvent.end = dateTimeString;

            this.isOpenMod = true;
            //this.showDialog = true;
            e.stopPropagation();
        },
        closeModal() {
            //this.showDialog = false;
            this.isOpenMod = false;
            this.selectEvent = [];
            this.addInv = '';
            this.remInv = '';
            this.remMails = [];
            this.invMails = [];
        },

        async editEvent(Id) {
            try {
                this.validateTitle();
                this.validateStartTime();
                this.validateEndTime();

                if (!this.titleError) {
                    alert('Title cannot be Empty !!');
                    return;
                }
                if (!this.startTimeError) {
                    alert('Start time should be mentioned');
                    return;
                }
                if (!this.endTimeError) {
                    alert('End time should be mentioned');
                    return;
                }

                this.addEmail(this.addInv,this.invMails);
                this.addEmail(this.remInv,this.remMails);

                let date = new Date(this.selectEvent.start);
                date.setHours(date.getHours() + 5, date.getMinutes() + 30);
                let date2 = new Date(this.selectEvent.end);
                date2.setHours(date2.getHours() + 5, date2.getMinutes() + 30);

                const response = await axios.post(`http://localhost:3000/api/editEvent/${Id}`, {
                    title: this.selectEvent.title,
                    description: this.selectEvent.description,
                    startDate: date,
                    endDate: date2,
                    attendeesToAdd: this.invMails,
                    attendeesToRemove: this.remMails
                }
                , { withCredentials: true });
                const userData = response.data;
                console.log("get wala", userData);
                this.triggerToast("Event Updated !!");
                this.displayEvent();
                // this.emit("loading");
                this.closeModal();
            } catch (error) {
                console.error("errrr", error);
            }
        },
        async deleteEvent(Id) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/delete/${Id}`, { withCredentials: true });
                const userData = response.data;
                console.log("deleted ye", userData);
                this.triggerToast("Event Deleted !!");
                this.displayEvent();
                this.closeModal();
            } catch (error) {
                console.error("errrr", error);
            }
        },
        // removeEvent(event) {
        //     this.events.splice(this.events.indexOf(event), 1);
        // },
    },

}
</script>

<style>
.modal2 {
  display: block;
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content2 {
  background-color: #ffeae3;
  margin: 10% auto;
  z-index: 4;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.vuecal__event {
    cursor: pointer;
    /* background-color: rgba(6, 23, 85, 0.692); */
    font-style: italic;
    /* z-index: 1; */
}

.vuecal__event-title {
  color: rgb(0, 0, 0);
  font-weight: bold;
  margin: 4px 0 8px;
}

.vuecal__event-time {
    font-weight: bold;
  color: rgb(0, 0, 0);
}

</style>

<!-- <style>
/* .outerCal {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
} */
.today {
    border: 1px solid #000;
    border-radius: 5px;
    background-color: rgb(175, 209, 239);
    color: #000;
}
</style> -->