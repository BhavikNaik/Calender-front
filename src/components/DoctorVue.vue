<template>
    <div class="heading">
        <div style="font-size: 1.4rem;font-weight: 600;">Resources:</div> 
        <button class="createEvent" style="background-color: #0040ffcc;color: black;font-weight: 600;" @click="showToast">Add Resource</button>
    </div>
    <Teleport to="body" v-if="showT">
        <div class="maintoast">
            <CreateResource @close="closeToast" @create-resource="handleFormSubmitted" />
        </div>
    </Teleport>
    <Teleport to="body" v-if="showTime">
        <div class="maintoast">
            <div class="toasti">
                <form @submit.prevent="updateTimings(this.selectedId)">
                    <div class="topi">
                        <span class="norText">
                            Add Timings !!
                        </span>
                        <button class="closeSymbol" @click="closeToast2">&times;</button>
                    </div>
                    <div v-for="(day, index) in daysOfWeek" :key="index" class="day">
                        <div style="font-size: 1.2rem;font-weight: 500;color: white;padding: 3px;margin-right: 25px;">{{ day }}:</div>
                        <div class="timings">
                            <!-- <div>
                                <span @click="addTimeSlot(day)">+</span>
                                <input type="time" v-model="startTimes[day][0]"> -
                                <input type="time" v-model="endTimes[day][0]">
                            </div>
                        </div>
                        <div v-if="schedule[day] && schedule[day].length > 0">
                            <div v-for="(time,tIndex) in schedule[day]" :key="time" class="timing">
                                <input type="time" v-model="startTimes[day][tIndex]"> -
                                <input type="time" v-model="endTimes[day][tIndex]">
                                <span @click="removeTimeSlot(day, tIndex)" class="fas fa-trash">-</span>
                            </div>
                        </div> -->
                            <div v-if="schedule[day] && schedule[day].length > 0">
                                <!-- First line of input with "+" symbol -->
                                <div class="timing">
                                    <div>
                                        <input type="time" v-model="startTimes[day][0]"> -
                                        <input type="time" v-model="endTimes[day][0]">
                                        <span @click="addTimeSlot(day,selectedEvent)" class="fas fa-plus" style="margin-left: 5px; color: aliceblue;"></span>
                                    </div>
                                </div>
                                <!-- Remaining time slots -->
                                <div v-for="(time, tIndex) in schedule[day].slice(1)" :key="tIndex" class="timing">
                                    <div>
                                        <input type="time" v-model="startTimes[day][tIndex+1]"> -
                                        <input type="time" v-model="endTimes[day][tIndex+1]">
                                        <span @click="removeTimeSlot(day, tIndex+1,selectedEvent)" class="fas fa-trash" style="margin-left: 5px; color: aliceblue;"></span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <input type="time" v-model="startTimes[day][0]"> - 
                                <input type="time" v-model="endTimes[day][0]">
                                <span @click="addTimeSlot(day,selectedEvent)" class="fas fa-plus" style="margin-left: 5px; color: aliceblue;"></span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="modfield">
                        <input type="time" v-model="times" id="times" placeholder="Time">
                        <span class="fas fa-clock"></span>
                    </div> -->
                    <input type="submit" value="Submit" class="modsubmit">
                </form>
            </div>
        </div>
    </Teleport>
    <!-- <div class="table-container" v-if="selectedContent == 'home'"> -->
        <div class="table" v-if="selectedContent == 'home'">
            <div class="table-head-all">
                <div class="head-single">TITLE</div>
                <div class="head-single">DESCRIPTION</div>
                <div class="head-single">EMAIL</div>
                <div class="head-single">CONTACT NO.</div>
                <div class="head-single">OPTIONS</div>
                <!-- <div class="head-single">SERVICES</div>
                <div class="head-single">BOOKINGS</div> -->
            </div>
            <div class="table-body-all" v-for="event in getResources" :key="event.id">
                <div class="body-single">{{ event.title }}</div>
                <div class="body-single">{{ event.description }}</div>
                <div class="body-single">{{ event.email }}</div>
                <div class="body-single">{{ event.phone_no }}</div>
                <div class="body-single">
                    <button class="btn-edit common" @click="showToast2(event)"><span class="fas fa-edit" style="color: blue;"></span></button>
                    <button class="btn-delete common" @click=""><span class="fas fa-trash" style="color: red;"></span></button>
                </div>
                <!-- <div class="body-single">{{ event.services }}</div> -->
                <!-- <div class="body-single">{{ event.related_to }}</div> -->
                <!-- <div class="body-single">{{ event.bookings }}</div> -->
                <!-- @mouseover="showAgent(event)" @mouseleave="hideAgent(event)"-->
                <!-- <span v-if="hoveredEvents === event.id" id="agentDetails">{{ event.creatorPhone }},<br> {{ event.creatorMail }}</span>  -->
            </div>
        </div>
    <!-- </div> -->
</template>

<script>
import axios from "axios";
import CreateResource from "./CreateResource.vue";
import { useToast } from 'vue-toastification';

    export default {
        components:{
            CreateResource,
        },
        data() {
            return {
                selectedContent: 'home',
                hoveredEvents: null,
                getResources: [],
                showT: false,
                showTime: false,
                daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                schedule: {},
                startTimes: {},
                endTimes: {},
                selectedId: '',
                selectedEvent: '',
            }
        },
        async mounted(){
            try {
                const response = await axios.get('http://localhost:3000/api/home', { withCredentials: true });
                const userData = response.data;
                console.log("ye", userData); // This will contain information about the currently logged-in user
                this.userId = response.data._id;
                this.createrPhone = response.data.phone_no;
                await this.getAllResources();
            } catch (error) {
                console.error("errrr", error);
            }
        },
        methods: {
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
            showToast() {
                this.showT = true;
            },
            closeToast() {
                this.showT = false;
            },
            handleFormSubmitted() {
                this.showT = false;
                console.log("Submitted");
            },
            showToast2(e) {
                this.showTime = true;
                this.schedule = e.workingHours;
                this.selectedId = e.id;
                this.selectedEvent = e;
                this.startTimes = {};
                this.endTimes = {};
                for (const day in this.schedule) {
                    const dayStartTimes = [];
                    const dayEndTimes = [];
                    for (let i = 0; i < this.schedule[day].length; i++) {
                        dayStartTimes.push(this.schedule[day][i].split(' - ')[0]);
                        dayEndTimes.push(this.schedule[day][i].split(' - ')[1]);
                }
                    this.startTimes[day] = dayStartTimes;
                    this.endTimes[day] = dayEndTimes;
                }
                console.log(this.schedule);
                // console.log(this.startTimes);
                // console.log(this.endTimes);
            },
            closeToast2() {
                this.showTime = false;
            },
            async updateTimings(Id) {
                for (const day of this.daysOfWeek) {
                    const timings = [];
                    for (let i = 0; i < this.startTimes[day].length; i++) {
                        const startTime = this.startTimes[day][i];
                        const endTime = this.endTimes[day][i];
                        timings.push(`${startTime} - ${endTime}`);
                    }
                    this.schedule[day] = timings;
                }
                try{
                    const response = await axios.put(`http://localhost:3000/api/edit-resource/${Id}`, {
                        workingHours: this.schedule,
                    }, { withCredentials: true });
                    console.log(response.data);
                    this.triggerToast("Work Timings Updated !!");
                }catch(e){
                    console.log(e);
                }
                console.log(this.schedule);
                console.log(this.startTimes);
                console.log(this.endTimes);
                this.showTime = false;
            },
            removeTimeSlot(day, tIndex, e) {
                // Remove the time slot at the specified index for the given day
                this.startTimes[day].splice(tIndex, 1);
                this.endTimes[day].splice(tIndex, 1);
                this.schedule[day].splice(tIndex, 1);
                // this.closeToast2();
                // this.showToast2(e);
            },
            addTimeSlot(day,e) {
                // Add a new empty time slot for the given day
                this.startTimes[day].push('');
                this.endTimes[day].push('');
                this.schedule[day].push('');
                // this.closeToast2();
                // this.showToast2(e);
            },
            async getAllResources() {
                try {
                    const response = await axios.get(`http://localhost:3000/api/getAllResources`, { withCredentials: true });
                    const userData = response.data;
                    console.log(userData);
                    this.getResources = [];

                    userData.forEach(item => {
                        this.getResources.push({
                            title: item.name,
                            description: item.description,
                            //related_to: item.related_to,
                            email: item.email,
                            phone_no: item.phone_no,
                            bookings: item.bookings,
                            services: item.services,
                            workingHours: item.workingHours,
                            id: item._id,
                        });
                    });
                    // console.log("thid",this.invitestarts);

                } catch (error) {
                    console.error("errrr", error);
                }
            },
        },
    }
</script>

<style scoped>
.heading{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px 12px;
}
.table-container {
    max-height: calc(100vh - 140px);
    overflow-x: auto;
    width: 100%;
    /* background-color: linear-gradient(to right, #0026ff, #0040ff, #0751f1, #cecece); */
}

.table {
    /* border: 1px solid #747373; */
    margin: 0 10px;
    min-width: 1080px;
    display: flex;
    flex-direction: column;
    max-width: calc(100vw - 250px);
    min-height: calc(100vh - 200px);
    font-family: 'Courier New', Courier, monospace;
}

.table-head-all {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    background-color: rgb(100, 100, 100);
    color: white;
    border-radius: 10px 10px 0 0;
    border-bottom: 3px solid rgba(255, 255, 255);
}

.table-body-all {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    border-top: 1px solid rgb(196, 196, 196);
    background-color: #e5e5e5;
    color: black;
    border-collapse: collapse;
    /* margin: 10px 20px; */
}


.head-single {
    border-right: 1px solid #000000;
    padding: 15px;
    font-size: 1.25rem;
    font-weight: 600;
    flex: 2 2;
    text-align: center;
    flex-wrap: nowrap;
}

.head-single:nth-child(2) {
    flex: 4 4;
}
.head-single:nth-child(5) {
    flex: 1 1;
}

/* .head-single:nth-child(6) {
    overflow-x: auto;
    word-break: break-all;
} */

.body-single {
    /* border:1px solid #747373; */
    padding: 10px 15px;
    align-items: center;
    flex: 2 2;
    text-align: center;
    max-height: 52px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: max-height 0.3s ease;
}

.body-single:nth-child(2) {
    flex: 4 4;
}
.body-single:nth-child(5) {
    padding: 5px 10px;
    flex: 1 1;
}

/* .body-single:nth-child(6) {
    word-break: break-all;
} */

.body-single:hover {
    max-height: none;
    overflow: auto;
    white-space: wrap;
}
.table-body-all:hover {
    /* border:1px solid #747373; */
    color: rgb(0, 0, 0);
    background-color: #d0d0d0;
}
.common{
    padding: 4px;
    margin-right: 5px;
    /* background-color: #535252; */
    box-shadow: 1px 1px 1px black;
}

.toasti {
  padding: 30px 50px;
  background-color: #302e2e;
}
.day{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgb(192, 192, 192);
    padding: 10px;
    /* align-items: center; */
}

</style>