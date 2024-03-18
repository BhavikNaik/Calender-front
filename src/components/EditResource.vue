<template>
    <div class="toasti">
        <form @submit.prevent="handleSubmit(eventData2.id)">
            <div class="topi">
                <span class="norText">
                    Updating Resource !!
                </span>
                <button class="closeSymbol" @click="close">&times;</button>
            </div>
            <div class="modfield">
                <input type="text" v-model="eventData2.title" id="title" placeholder="Title">
                <span class="fas fa-tag"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="eventData2.description" id="description" placeholder="Description">
                <span class="fas fa-info-circle"></span>
            </div>
            <div class="modfield">
               <input type="text" v-model="eventData2.email" id="mail" placeholder="Email Id">
               <span class="fas fa-envelope"></span>
            </div>
            <div class="modfield">
              <input type="text" v-model="eventData2.phone_no" id="contactNo" placeholder="Phone Number">
              <span class="fas fa-phone"></span>
           </div>
            <!-- <div class="modfield">
                <input type="text" v-model="eventData2.duration" id="duration" placeholder="Duration in Minutes">
                <span class="fas fa-clock"></span>
            </div> -->
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
    props: ['eventData2'],
    data() {
        return {
            title: '',
            description: '',
            host:'',
            ownmail: '',
            mail: '',
            contactNo: '',
            duration: '',
            titleError: '',
            resources: [],
            fullResources: [],
            slots:'',
        }
    },
    async mounted(){
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            this.host = response.data.id; // This will contain information about the currently logged-in user
            this.ownmail = response.data.email;
            //this.getServices();
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
        // getEmail(){
        //     this.host = this.$cookies.get('email');
        // },
        async handleSubmit(Id) {
            // this.validateTitle();
            //this.validateStartTime();
            // this.validateEndTime();

            // if (!this.titleError) {
            //    alert('Title cannot be Empty !!');
            //    return;
            // }

            // this.addEmail();

            console.log('Form: ', this.eventData2.title,"",this.eventData2.description,"",this.eventData2.email,"",this.eventData2.phone_no,"",this.eventData2.duration);
            try {
                const response = await axios.put(`http://localhost:3000/api/edit-resource/${Id}`,{
                    name: this.eventData2.title,
                    description: this.eventData2.description,
                    email: this.eventData2.email,
                    phone_no: this.eventData2.phone_no,
                    // duration: this.eventData2.duration,

                }, { withCredentials: true });
                console.log(response.data);
                this.$emit('edit-resource', response.data);
                this.triggerToast("Resource Updated Successfully !!");
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

<style>
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