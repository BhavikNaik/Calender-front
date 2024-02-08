<template>
    <div class="toast">
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
        }
    },
    methods: {
        addEmail() {
            // Trim the input value and split it by commas to get multiple email addresses
            const newEmails = this.emailsInput.trim().split(',');
            
            // Loop through the new email addresses and add them to the existing array
            newEmails.forEach(email => {
                const trimmedEmail = email.trim();
                if (trimmedEmail) {
                    this.mails.push(trimmedEmail);
                }
            });
            
            // Clear the input field
            this.emailsInput = '';
        },
        async handleSubmit() {
            console.log("handling submit")
            
            this.addEmail();
            console.log('Form: ', this.ename,"",this.description,"",this.startTime,"",this.endTime,"",this.mails,"",this.host);
            try {
                const response = await axios.post('http://localhost:3000/create-event', {
                    title: this.ename,
                    description: this.description,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    emails: this.mails,
                    host: this.host,
                });
                console.log('Event created:', response.data);

                this.$emit('create-event', response.data);
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

.toast {
  padding: 30px 80px;
  background-color: #302e2e;
}


</style>