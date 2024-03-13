<template>
    <div class="toasti">
        <form @submit.prevent="handleSubmit">
            <div class="topi">
                <span class="norText">
                    Creating Service !!
                </span>
                <button class="closeSymbol" @click="close">&times;</button>
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
                <input type="text" v-model="addResources" id="addResources" placeholder="Add Resources">
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
            title: '',
            description: '',
            host:'',
            ownmail: '',
            addResources: '',
            titleError: '',
            //startTimeError: '',
            statuses: ['In-progress', 'Open', 'Closed', 'Waiting'],
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
        async addService(){
                try {
                    const response = await axios.post(`http://localhost:3000/api/add-service`,{
                        name: this.name,
                        description: this.description,
                        addResources: this.addResources,

                    }, { withCredentials: true });
                    const userData = response.data;
                    console.log(userData);
                    this.triggerToast("Service Added");
                    //this.getResources = [];

                } catch (error) {
                    console.error("errrr", error);
                }
        },
        // getEmail(){
        //     this.host = this.$cookies.get('email');
        // },
        async handleSubmit() {
            this.validateTitle();
            //this.validateStartTime();
            // this.validateEndTime();

            if (!this.titleError) {
               alert('Title cannot be Empty !!');
               return;
            }
            // if (!this.endTimeError) {
            //    alert('End time should be mentioned');
            //    return;
            // }

            // this.addEmail();

            console.log('Form: ', this.title,"",this.description,"",this.addResources);
            try {
                const response = await axios.post(`http://localhost:3000/api/add-service`,{
                        name: this.title,
                        description: this.description,
                        addResources: this.addResources,

                    }, { withCredentials: true });
                console.log(response.data);
                this.$emit('create-service', response.data);
                this.triggerToast("Service Added Successfully !!");
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