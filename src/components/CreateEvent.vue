<template>
    <div class="toasti">
        <form @submit.prevent="handleSubmit">
            <div class="topi">
                <span class="norText">
                    Create an Event !!
                </span>
                <button class="closeSymbol" @click="close">X</button>
            </div>
            <div class="modfield">
                <input type="text" v-model="ename" id="ename" placeholder="Name">
                <span class="fas fa-user"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="description" id="description" placeholder="Description">
                <span class="fas fa-envelope"></span>
            </div>
            <div class="modfield">
                <input type="datetime-local" v-model="startTime" id="startTime" placeholder="Start Time">
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <input type="datetime-local" v-model="endTime" id="endTime" placeholder="End Time">
                <span class="fas fa-clock"></span>
            </div>
            <div class="modfield">
                <input type="text" v-model="emailsInput" id="emailsInput" placeholder="Email Id of Invitees">
                <span class="fas fa-envelope"></span>
            </div>
            <input type="submit" value="Submit" class="modsubmit">
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            ename: '',
            description: '',
            startTime: '',
            endTime: '',
            emailsInput: '',
            mails: [],
            host:'',
            ownmail: '',
            titleError: '',
            startTimeError: '',
            endTimeError: '',
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
            if(this.startTime.length < 6) {
               //alert('Password must be at least 6 characters');
               this.startTimeError=false;
            } else{
               this.startTimeError=true;
            }
         },
         validateEndTime() {
            if(this.endTime.length < 6) {
               //alert('Password must be at least 6 characters');
               this.endTimeError=false;
            } else{
               this.endTimeError=true;
            }
         },
        addEmail() {
            // Trim the input value and split it by commas to get multiple email addresses
            const newEmails = this.emailsInput.trim().split(',');
            
            // Loop through the new email addresses and add them to the existing array
            newEmails.forEach(email => {
                const trimmedEmail = email.trim();
                if (trimmedEmail && trimmedEmail != this.ownmail) {
                    this.mails.push(trimmedEmail);
                }
            });
            
            // Clear the input field
            this.emailsInput = '';
        },
        // getEmail(){
        //     this.host = this.$cookies.get('email');
        // },
        async handleSubmit() {
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

            this.addEmail();

            const startDate = new Date(this.startTime);
            startDate.setHours(startDate.getHours() + 5, startDate.getMinutes() + 30);

            // Convert end time to IST
            const endDate = new Date(this.endTime);
            endDate.setHours(endDate.getHours() + 5, endDate.getMinutes() + 30);
            // this.getEmail();
            console.log('Form: ', this.ename,"",this.description,"",this.startTime,"",this.endTime,"",this.mails,"",this.host);
            try {
                const response = await axios.post(`http://localhost:3000/api/create-event`, {
                    title: this.ename,
                    description: this.description,
                    startDate: startDate,
                    endDate: endDate,
                    emails: this.mails,
                    host: this.host,
                },{withCredentials: true});
                console.log('Event created:', response.data);
                this.$emit('create-event', response.data);
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