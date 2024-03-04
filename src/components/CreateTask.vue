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
                <select v-model="ename" id="ename" style="padding: 5px 10px; width: 100%; padding-left: 40px;font-size: 1rem;">
                    <option class="inside-options" value="" disabled selected>Select Department</option>
                    <option class="inside-options" v-for="dept in departments" :value="dept">{{ dept }}</option>
                </select>
                <span class="fas fa-heading"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="description" id="description" placeholder="Description">
                <span class="fas fa-info-circle"></span>
            </div>
            <div class="modfield">
                <input type="datetime-local" v-model="startDates" id="startDates" placeholder="Date">
                <span class="fas fa-clock"></span>
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
            ename: '',
            description: '',
            startDates: '',
            host:'',
            ownmail: '',
            contactNo: '',
            titleError: '',
            startTimeError: '',
            statuses: ['In-progress', 'Open', 'Closed', 'Waiting'],
            departments: ['Pediatric', 'Gynaecologist', 'Radiology', 'Neurology']
        }
    },
    async mounted(){
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            this.host = response.data.id; // This will contain information about the currently logged-in user
            this.ownmail = response.data.email;
        } catch (error) {
            console.error("errrr",error);
        }
        // this.host = userData;
        // await this.getMail();
    },
    methods: {
        validateTitle() {
            // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(this.ename.length < 1) {
               //alert('Invalid email address');
               this.titleError=false;
            } else{
               this.titleError=true;
            }
         },
         validateStartTime() {
            if(this.startDates.length < 6) {
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
            // if (!this.endTimeError) {
            //    alert('End time should be mentioned');
            //    return;
            // }

            // this.addEmail();

            //this.startTime = new Date(this.startTime);
            // startDate.setHours(startDate.getHours() + 5, startDate.getMinutes() + 30);

            // // Convert end time to IST
            //this.endTime = new Date(this.endTime);
            // endDate.setHours(endDate.getHours() + 5, endDate.getMinutes() + 30);
            // this.getEmail();
            console.log('Form: ', this.ename,"",this.description,"",this.startDates,"",this.contactNo,"",this.host);
            try {
                let response;
                if(this.contactNo.length < 1){
                    response = await axios.post(`http://localhost:3000/api/create-task`, {
                        title: this.ename,
                        description: this.description,
                        dueDate: this.startDates,
                        creator: this.host,
                    },{withCredentials: true});
                }else{
                    response = await axios.post(`http://localhost:3000/api/create-task`, {
                        title: this.ename,
                        description: this.description,
                        dueDate: this.startDates,
                        related_to: this.contactNo,
                        creator: this.host,
                    },{withCredentials: true});
                }
                console.log('Event created:', response.data);
                this.$emit('create-task', response.data);
                this.triggerToast("Task Added Successfully !!");
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