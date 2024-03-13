<template>
    <div class="toasti">
        <form @submit.prevent="handleSubmit">
            <div class="topi">
                <span class="norText">
                    Creating Task !!
                </span>
                <button class="closeSymbol" @click="close">&times;</button>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="department" id="department" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;" @change="getResources(department)">
                    <option class="inside-options" value="" disabled selected>Select Department</option>
                    <option class="inside-options" v-for="dept in services" :value="dept">{{ dept }}</option>
                </select>
                <span class="fas fa-heading"></span>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="doctor" id="doctor" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <option class="inside-options" value="" disabled selected>Select Doctor</option>
                    <option class="inside-options" v-for="doc in resources" :value="doc">{{ doc }}</option>
                </select>
                <span class="fas fa-user"></span>
            </div>
            <div class="modfield">
                <input type="date" v-model="startDate" id="startDate" placeholder="Date" @change="this.getAvailableSlots(this.department, this.doctor, this.startDate)">
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <!-- <input type="text" v-model="ename" id="ename" placeholder="Title"> -->
                <select v-model="slots" id="slots" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <option class="inside-options" value="" disabled selected>Available Slots</option>
                    <option class="inside-options" v-for="dept in availableSlots" :value="dept">{{ dept.startTime }} - {{ dept.endTime }}</option>
                </select>
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="title" id="title" placeholder="Title">
                <span class="fas fa-tag"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="description" id="description" placeholder="Description">
                <span class="fas fa-info-circle"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="contactNo" id="contactNo" placeholder="Phone Number">
                <span class="fas fa-phone"></span>
            </div>
            <!-- <div class="modfield">
                <input type="time" v-model="times" id="times" placeholder="Time">
                <span class="fas fa-clock"></span>
            </div> -->
            <input type="submit" value="Submit" class="modsubmit">
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
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
            contactNo: '',
            titleError: '',
            startTimeError: '',
            statuses: ['In-progress', 'Open', 'Closed', 'Waiting'],
            //departments: ['Pediatric', 'Gynaecologist', 'Radiology', 'Neurology'],
            resources: [],
            fullResources: [],
            services: [],
            fullServices: [],
            availableSlots: [],
            slots:'',
        }
    },
    async mounted(){
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            this.host = response.data.id; // This will contain information about the currently logged-in user
            this.ownmail = response.data.email;
            this.getServices();
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
        async handleSubmit() {
            this.validateTitle();
            this.validateStartTime();
            // this.validateEndTime();

            if (!this.titleError) {
               alert('Title cannot be Empty !!');
               return;
            }
            if (!this.startTimeError) {
               alert('Date and time should be mentioned');
               return;
            }
            if(this.department === '' || this.doctor === ''){
                alert('Department and Doctor should be selected');
                return;
            }
            // if (!this.endTimeError) {
            //    alert('End time should be mentioned');
            //    return;
            // }

            // this.addEmail();

            this.startTime = new Date(this.startDate);

            let startTimeParts = this.slots.startTime.split(':');
            let endTimeParts = this.slots.endTime.split(':');

            let StartTime = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), startTimeParts[0], startTimeParts[1]).toISOString();
            let EndTime = new Date(this.startTime.getFullYear(), this.startTime.getMonth(), this.startTime.getDate(), endTimeParts[0],endTimeParts[1]).toISOString();
            // startDate.setHours(startDate.getHours() + 5, startDate.getMinutes() + 30);

            // // Convert end time to IST
            //this.endTime = new Date(this.endTime);
            // endDate.setHours(endDate.getHours() + 5, endDate.getMinutes() + 30);
            // this.getEmail();
            console.log('Form: ', this.department,"",this.doctor,"", this.title,"",this.description,"",StartTime,"", EndTime,"",this.contactNo,"",this.host);
            try {
                let response;
                if(this.contactNo.length < 1){
                    response = await axios.post(`http://localhost:3000/api/create-booking`, {
                        service: this.department,
                        resource: this.doctor,
                        title: this.title,
                        description: this.description,
                        startDate: StartTime,
                        endDate: EndTime,
                        creator: this.host,
                    },{withCredentials: true});
                }else{
                    response = await axios.post(`http://localhost:3000/api/create-booking`, {
                        service: this.department,
                        resource: this.doctor,
                        title: this.title,
                        description: this.description,
                        startDate: StartTime,
                        endDate: EndTime,
                        related_to: this.contactNo,
                        creator: this.host,
                    },{withCredentials: true});
                }
                console.log('Event created:', response.data);
                this.$emit('create-task', response.data);
                this.triggerToast("Booking Added Successfully !!");
                this.mails = [];
                this.emails ='';
                this.$emit('close');
            } catch (error) {
                console.error('Error creating event:', error);
            }
        },
        close(){
            this.$emit('close');
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