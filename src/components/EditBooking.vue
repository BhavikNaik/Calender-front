<template>
    <div class="toasti">
        <form @submit.prevent="submitForm(this.hereEvent.id)">
            <div class="topi">
                <span class="norText">
                    Edit Task !!
                </span>
                <button class="closeSymbol" @click="close">&times;</button>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="hereEvent.service" id="department" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;" @change="getResources(hereEvent.service)">
                    <!-- <option class="inside-options" value="hereEvent.department" selected>{{ hereEvent.department }}</option> -->
                    <option class="inside-options" v-for="dept in services" :value="dept">{{ dept }}</option>
                </select>
                <span class="fas fa-heading"></span>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="hereEvent.resource" id="doctor" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <!-- <option class="inside-options" value="" disabled selected>Select Doctor</option> -->
                    <option class="inside-options" v-for="doc in resources" :value="doc">{{ doc }}</option>
                </select>
                <span class="fas fa-user"></span>
            </div>
            <div class="modfield">
                <input type="date" v-model="hereEvent.startDate" id="startDate" placeholder="Date" @change="this.getAvailableSlots(this.hereEvent.service, this.hereEvent.resource, this.hereEvent.startDate)">
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="slots" id="slots" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <option class="inside-options" value="" selected>{{ hereEvent.slots }}</option>
                    <option class="inside-options" v-for="dept in availableSlots" :value="dept">{{ dept.startTime }} - {{ dept.endTime }}</option>
                </select>
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="hereEvent.status" id="status" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <!-- <option class="inside-options" value="hereEvent.department" selected>{{ hereEvent.department }}</option> -->
                    <option class="inside-options" v-for="dept in statuses" :value="dept">{{ dept }}</option>
                </select>
                <span class="fas fa-heading"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="hereEvent.title" id="title" placeholder="Title">
                <span class="fas fa-tag"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="hereEvent.related_to" id="related_to" placeholder="Phone Number">
                <span class="fas fa-phone"></span>
            </div>
            <div class="modfieldT">
                <textarea v-model="hereEvent.description" id="description" placeholder="Add Notes..."></textarea>
            </div>
            <!-- <div class="modfield">
                <input type="time" v-model="times" id="times" placeholder="Time">
                <span class="fas fa-clock"></span>
            </div> -->
            <div style="display: flex; justify-content: space-between; font-size: 0.4rem;">
                <input style="font-size: 0.8rem;" type="submit" value="Edit Booking" class="modsubmit">
                <input style="font-size: 0.8rem;" type="submit" value="Delete Booking" class="modsubmit">
            </div>
        </form>
    </div>
</template>

<script>
import Aghome from "./Aghome.vue";
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    props: ['eventData'],
    data() {
        return {
            department: '',
            doctor:'',
            title: '',
            description: '',
            startDate: '',
            startTime: '',
            host:'',
            ownmail: '',
            related_to: '',
            titleError: '',
            startTimeError: '',
            statuses: ['Pending', 'Confirmed', 'Cancelled', 'Closed'],
            //departments: ['Pediatric', 'Gynaecologist', 'Radiology', 'Neurology'],
            resources: [],
            fullResources: [],
            services: [],
            fullServices: [],
            availableSlots: [],
            slots:'',
            hereEvent:[],
            thatDate: '',

        }
    },
    async mounted(){
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            this.host = response.data.id; // This will contain information about the currently logged-in user
            this.ownmail = response.data.email;
            this.hereEvent = this.eventData;
            let parts = this.hereEvent.startDate.split('-');
            if(parts[2].length === 4){
                this.hereEvent.startDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            this.hereEvent.slots = (this.hereEvent.startTime + " - " + this.hereEvent.endTime);
            console.log(this.hereEvent.slots);
            await this.getServices();
            await this.getResources(this.hereEvent.service);
            await this.getAvailableSlots(this.hereEvent.service, this.hereEvent.resource, this.hereEvent.startDate);
        } catch (error) {
            console.error("errrr",error);
        }
        // this.host = userData;
        // await this.getMail();
    },
    methods: {
        validateTitle() {
            // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(this.title.length < 1) {
               //alert('Invalid email address');
               this.titleError=false;
            } else{
               this.titleError=true;
            }
         },
         validateStartTime() {
            if(this.startDate.length < 6) {
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
         findIdByName(name, arr) {
            const foundItem = arr.find(item => item.name === name);
            return foundItem ? foundItem.id : null;
        },
         async getResources(docs){
            try {
                const response = await axios.get(`http://localhost:3000/api/resources/${docs}`,{  withCredentials: true });
                const userData2 = response.data;
                console.log("doctors:",userData2);
                this.resources = [];

                userData2.forEach(item => {
                    this.resources.push(item.name);
                });

                userData2.forEach(item => {
                    this.fullResources.push({
                        name: item.name,
                        id: item._id
                    });
                });
                console.log(this.fullResources);
            } catch (error) {
                console.error("errrr",error);
            }
         },
         async getServices(){
            try {
                const response = await axios.get('http://localhost:3000/api/getServices',{  withCredentials: true });
                const userData = response.data;
                console.log("services:",userData);
                this.services = [];

                userData.forEach(item => {
                    this.services.push(item.name);
                });
                userData.forEach(item => {
                    this.fullServices.push({
                        name:item.name,
                        id:item._id,
                        resources: item.resources,
                        durations: item.durations
                    });
                });
            } catch (error) {
                console.error("errrr",error);
            }
         },
         async getAvailableSlots(serviceName, resourceName, sDate) {
            try {
                const sId = this.findIdByName(serviceName, this.fullServices);
                const rId = this.findIdByName(resourceName, this.fullResources);

                const response = await axios.get(`http://localhost:3000/api/availableTimeSlots/${sId}/${rId}/${sDate}`,{  withCredentials: true });
                const userData = response.data;
                console.log("slots:",userData);
                this.availableSlots = [];
                userData.forEach(item => {
                    this.availableSlots.push({
                        startTime: item.startTime,
                        endTime: item.endTime
                    });
                });
            } catch (error) {
                console.error("errrr",error);
            }
         },
        // getEmail(){
        //     this.host = this.$cookies.get('email');
        // },
        async handleSubmit(Id) {
            //this.validateTitle();
            //this.validateStartTime();
            // this.validateEndTime();

            // if (!this.titleError) {
            //    alert('Title cannot be Empty !!');
            //    return;
            // }
            // if (!this.startTimeError) {
            //    alert('Date and time should be mentioned');
            //    return;
            // }
            // if(this.department === '' || this.doctor === ''){
            //     alert('Department and Doctor should be selected');
            //     return;
            // }
            // if (!this.endTimeError) {
            //    alert('End time should be mentioned');
            //    return;
            // }

            // this.addEmail();
            this.thatDate = new Date(this.hereEvent.startDate);
            //this.hereEvent.startDate = new Date(this.hereEvent.startDate);
            //console.log(this.slots);

            let startTimeParts = this.hereEvent.startTime.split(':');
            let endTimeParts = this.hereEvent.endTime.split(':');

            let StartTime = new Date(this.thatDate.getFullYear(), this.thatDate.getMonth(), this.thatDate.getDate(), startTimeParts[0], startTimeParts[1]).toISOString();
            let EndTime = new Date(this.thatDate.getFullYear(), this.thatDate.getMonth(), this.thatDate.getDate(), endTimeParts[0],endTimeParts[1]).toISOString();
            
            // startDate.setHours(startDate.getHours() + 5, startDate.getMinutes() + 30);

            // // Convert end time to IST
            //this.endTime = new Date(this.endTime);
            // endDate.setHours(endDate.getHours() + 5, endDate.getMinutes() + 30);
            // this.getEmail();
            console.log('Form: ', this.hereEvent.service,"",this.hereEvent.resource,"", this.hereEvent.title,"",this.hereEvent.description,"",StartTime,"", EndTime,"",this.hereEvent.related_to,"",this.host);
            console.log('Form: ', this.hereEvent);
            try {
                let response;
                if(this.related_to.length < 1){
                    response = await axios.put(`http://localhost:3000/api/editBooking/${Id}`, {
                        serviceName: this.hereEvent.service,
                        resourceName: this.hereEvent.resource,
                        title: this.hereEvent.title,
                        description: this.hereEvent.description,
                        startDate: StartTime,
                        endDate: EndTime,
                        status: this.hereEvent.status
                    },{withCredentials: true});
                }else{
                    response = await axios.put(`http://localhost:3000/api/editBooking/${Id}`, {
                        serviceName: this.hereEvent.service,
                        resourceName: this.hereEvent.resource,
                        title: this.hereEvent.title,
                        description: this.hereEvent.description,
                        startDate: StartTime,
                        endDate: EndTime,
                        related_to: this.hereEvent.related_to,
                        status: this.hereEvent.status
                    },{withCredentials: true});
                }
                console.log('Event Updated:', response.data);
                this.$emit('edit-task', response.data);
                this.triggerToast("Event Updated Successfully !!");
                // this.mails = [];
                // this.emails ='';
                this.$emit('close2');
                this.hereEvent = [];
            } catch (error) {
                console.error('Error creating event:', error);
            }
        },
        async cancelBooking(Id){
            try {
                const response = await axios.put(`http://localhost:3000/api/cancel-booking/${Id}`,{},{  withCredentials: true });
                console.log('Booking Deleted:', response.data);
                //this.$emit('edit-task', response.data);
                this.triggerToast("Booking Deleted Successfully!!");
                this.$emit('close2');
                this.hereEvent = [];
            } catch (error) {
                console.error('Error creating event:', error);
            }
        },
        close(){
            this.$emit('close2');
        },
        async submitForm(Id){
            const action = event.submitter.value;

            if (action === 'Edit') {
                await this.handleSubmit(Id);
            } else if (action === 'Cancel') {
                await this.cancelBooking(Id);
            }
        }
    },


}
</script>

<style scoped>
.custom-toast {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
}

.toasti {
  padding: 30px 50px;
  background-color: #302e2e;
}

</style>