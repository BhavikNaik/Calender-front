<template>
    <VueCal class="calendar" 
    :disable-views="['years', 'year', 'month']" 
     
    :events="events"/>
    <!-- :time-from="8 * 60" 
    :time-to="20 * 60" -->
        <!-- style="max-height: 750px;min-width: 100%" -->
        <!-- <VDatePicker /> -->
    <!-- </div> -->
</template>

<script>
import axios from 'axios';
import VueCal from 'vue-cal';

export default {
    components:{
        VueCal,
    },
    data() {
        return {
            date: new Date(),
            events:[],
            userId:'',
            stime:'',
            etime:'',   
        }
    },
    async mounted() {
        try {
            const response = await axios.get('http://localhost:3000/api/home',{  withCredentials: true });
            // const userData = response.data;
            // console.log(userData); // This will contain information about the currently logged-in user
            this.userId = response.data._id;
            this.displayEvent();
            // console.log(this.userId);
        } catch (error) {
            console.error("errrr",error);
        }
    },
    methods: {
        // addEvent() {
        //     this.events.push({
        //         title: 'New Event',
        //         start: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 10, 30),
        //         end: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 12, 30),
        //     });
        // },
        async displayEvent(){
            try {
                const response = await axios.get('http://localhost:3000/api/get-events', {  withCredentials: true });
                const userData = response.data;
                console.log(userData);
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
                    });
                });
            } catch (error) {
                console.error("errrr",error);
            }
        }
        // removeEvent(event) {
        //     this.events.splice(this.events.indexOf(event), 1);
        // },
    },
}
</script>

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