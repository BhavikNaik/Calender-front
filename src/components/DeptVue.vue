<template>
    <div class="heading">
        <div style="font-size: 1.4rem;font-weight: 600;">Services:</div> 
        <button class="createEvent" style="background-color: #0040ffcc;color: black;font-weight: 600;position:sticky;" @click="showToast">Add Service</button>
    </div>
    <Teleport to="body" v-if="showT">
        <div class="maintoast">
            <CreateService @close="closeToast" @create-service="handleFormSubmitted" />
        </div>
    </Teleport>
    <Teleport to="body" v-if="showEditRes">
        <div class="maintoast">
            <div class="toasti">
                <form @submit.prevent="editSer(this.editServiceId)">
                    <div class="topi">
                        <span class="norText">
                            Editing Service !!
                        </span>
                        <button class="closeSymbol" @click="closeEdit">&times;</button>
                    </div>
                    <div class="modfield">
                        <input type="text" v-model="titleS" id="titleS" placeholder="Title">
                        <span class="fas fa-tag"></span>
                    </div>
                    <div class="modfield">
                        <input type="text" v-model="descriptionS" id="descriptionS" placeholder="Description">
                        <span class="fas fa-info-circle"></span>
                    </div>
                    <div class="modfield">
                        <input type="text" v-model="addResourcesS" id="addResourcesS" placeholder="Add Resources">
                        <span class="fas fa-phone"></span>
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
    <Teleport to="body" v-if="showAddRes">
        <div class="maintoast">
            <div class="toasti">
                <form @submit.prevent="addRes(this.serviceId)">
                    <div class="topi">
                        <span class="norText">
                            Adding Resource !!
                        </span>
                        <button class="closeSymbol" @click="closeAdd">&times;</button>
                    </div>
                    <div class="modfield">
                        <input type="text" v-model="title" id="title" placeholder="Resource Name">
                        <span class="fas fa-user"></span>
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
    <div class="table-services">
        <div>
            <div v-for="service in getService" @click="showToast2(service)" class="services">
                <div class="services2">
                    <div class="inner-service">
                        <div style="margin: 2px;margin-right: 15px;">
                            <button @click="showToggle(service,service.id)" v-if="!show || service.id !== serviceId" style="background:none;cursor: pointer;border: none;outline: none;">
                                <!-- <span class="fas fa-chevron-down"></span> -->
                                <span class="fas fa-chevron-down"></span>
                            </button>
                            <button @click="closeToggle(service,service.id)" v-else-if="service.id === serviceId" style="background:none;cursor: pointer;border: none;outline: none;">
                                <!-- <span class="fas fa-chevron-down"></span> -->
                                <span class="fas fa-chevron-up"></span>
                            </button>
                        </div>
                        <div>
                            <div style="font-size: 1.2rem;font-weight: 500;" class="service-title">{{service.title}}</div>
                            <div style="font-size: 1rem;font-weight: 400;max-width: 300px;" class="service-desc">{{service.description}}</div>
                        </div>
                    </div>
                    <div>
                        <button class="createEvent common" @click="showAdd(service)" style="background-color: black;color: aliceblue; font-weight: 400;font-size: 1rem; padding: 7px 15px;">Add Resource</button>
                        <button class="btn-edit common" @click="showEdit(service)"><span class="fas fa-edit" style="color: blue;"></span></button>
                        <button class="btn-delete common" @click=""><span class="fas fa-trash" style="color: red;"></span></button>
                    </div>
                </div>
                <div v-if="isToggle && service.id === serviceId" class="inner-res" v-for="name in displayList">
                    <div>
                        <div style="font-size: 1rem;font-weight: 500;" class="service-title">{{name}}</div>
                    </div>
                    <div>
                        <button class="createEvent common" @click="" style="background-color: black;color: aliceblue; font-weight: 400;font-size: 0.85rem; padding: 5px 10px; margin-bottom: 5px;">View Bookings</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import CreateService from './CreateService.vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
    components: {
        CreateService,
    },
        data() {
            return {
                selectedContent: 'dept',
                hoveredEvents: null,
                getService: [],
                showT: false,
                showDetails: false,
                showAddRes: false,
                title: '',
                resources: [],
                serviceId: '',
                editServiceId: '',
                showEditRes: false,
                titleS: '',
                descriptionS: '',
                addResourcesS: '',
                editServicesS: [],
                getListResources: [],
                getListNames: [],
                displayList: [],
                isToggle: false,
                show: false,
                times: '',
            }
        },
        async mounted(){
            try {
                const response = await axios.get('http://localhost:3000/api/home', { withCredentials: true });
                const userData = response.data;
                console.log("ye", userData); // This will contain information about the currently logged-in user
                this.userId = response.data._id;
                this.createrPhone = response.data.phone_no;
                await this.getServices();
            } catch (error) {
                console.error("errrr", error);
            }
        },
        methods: {
            // showAgent(event) {
            //     this.hoveredEvents = event.id;
            // },
            // hideAgent(event) {
            //     this.hoveredEvents = null;
            // },
            async getServices() {
                try {
                    const response = await axios.get(`http://localhost:3000/api/getServices`, { withCredentials: true });
                    const userData = response.data;
                    console.log(userData);
                    this.getService = [];

                    userData.forEach(item => {
                        this.getService.push({
                            title: item.name,
                            description: item.description,
                            //related_to: item.related_to,
                            resources: item.resources,
                            id: item._id,
                        });
                    });
                    // console.log("thid",this.invitestarts);

                } catch (error) {
                    console.error("errrr", error);
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
            showToast() {
                this.showT = true;
            },
            closeToast() {
                this.showT = false;
            },
            showToast2(e) {
                this.showDetails = true;
                console.log(e);
            },
            closeToast2() {
                this.showDetails = false;
            },
            handleFormSubmitted() {
                this.showT = false;
                console.log("Submitted");
            },
            showAdd(e) {
                this.showAddRes = true;
                this.serviceId = e.id;
                console.log(e);
                console.log(this.serviceId);
            },
            closeAdd() {
                this.showAddRes = false;
                this.serviceId = '';
            },
            async addRes(Id){
                // console.log(this.title);
                // this.resources.push(this.title);
                // console.log(this.resources);
                try {
                    this.resources.push(this.title);
                    const response2 = await axios.put(`http://localhost:3000/api/${Id}/resources`,{
                        resources: this.resources,
                    }, { withCredentials: true });
                    const userData2 = response2.data;
                    console.log(userData2);
                    this.showAddRes = false;
                    this.serviceId = '';
                    this.triggerToast("Resource Added !!");
                } catch (error) {
                    console.error("errrr", error);
                }
            },
            showEdit(e) {
                this.showEditRes = true;
                this.editServicesS = e;
                this.editServiceId = e.id;
                this.titleS = e.title;
                this.descriptionS = e.description;
                this.addResourcesS = e.resources;
                console.log(this.editServicesS);
                // console.log(this.editServiceId);
                // console.log(this.titleS);
                // console.log(this.descriptionS);
                console.log(this.addResourcesS);
            },
            closeEdit() {
                this.showEditRes = false;
                this.editServicesS = '';
                this.editServiceId = '';
                this.titleS = '';
                this.descriptionS = '';
                this.addResourcesS = '';
            },
            async editSer(Id){
                // console.log(this.title);
                // this.resources.push(this.title);
                this.addResourcesS = this.addResourcesS.split(',');
                console.log(this.addResourcesS);
                try {
                    //this.resources.push(this.title);
                    const response3 = await axios.put(`http://localhost:3000/api/edit-service/${Id}`,{
                        name: this.titleS,
                        description: this.descriptionS,
                        resources: this.addResourcesS,
                    }, { withCredentials: true });
                    const userData3 = response3.data;
                    console.log(userData3);
                    this.showEditRes = false;
                    this.editServicesS = '';
                    this.editServiceId = '';
                    this.titleS = '';
                    this.descriptionS = '';
                    this.addResourcesS = '';
                    this.triggerToast("Service Added !!");
                } catch (error) {
                    console.error("errrr", error);
                }
            },
            async showToggle(e,eId) {

                if(this.show && eId !== this.serviceId) {
                    this.closeToggle(e,eId);
                }
                    this.isToggle = true;
                    this.show = true;
                    console.log(this.displayList);
                    this.serviceId = eId;
                    // e.show = !e.show;
                    

                    this.getListNames = e.resources;
                    //await this.listResources(e.title);
                    for(let i = 0; i < this.getListNames.length; i++) {
                        this.displayList.push(this.getListNames[i]);
                        // this.displayList.push({this.show
                    }
                    console.log(this.displayList);
                    console.log(this.serviceId);
                
                //this.showAddRes = true;
            },
            
            closeToggle(e,eId) {
                //this.showAddRes = false;
                this.isToggle = false;
                this.show = false;
                this.displayList = [];
                this.serviceId = '';
                this.getListNames = [];
            },
            async listResources(Name){
                try {
                    const response = await axios.get(`http://localhost:3000/api/getServices?service=${Name}`, { withCredentials: true });
                    const userData4 = response.data;
                    console.log(userData4);
                    this.getListResources = [];

                    userData4.forEach(item => {
                        this.getListResources.push({
                            resources: item.resources,
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
    /* width: 100%; */
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
    /* width: 100%; */
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

.table-services{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column; 
    max-height: calc(100vh - 164px);
    overflow-x: auto;
    min-width: 600px;
    /* width: 100%; */
    /* border-top: 1px solid rgb(196, 196, 196); */
    background-color: #e5e5e5;
    color: black;
    border-collapse: collapse;
    margin: 10px 20px;
    padding: 15px;
}
.services{
    border-top: 1px solid rgb(196, 196, 196);
    border-collapse: collapse;
    /* margin: 10px 20px; */
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    /* max-height: 52px; */
    /* transition: max-height 0.3s ease; */
}
.services2{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /* max-height: 52px; */
    /* transition: max-height 0.3s ease; */
}
.services2 div{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.services2 div:hover {
    max-height: none;
    overflow: auto;
    white-space: wrap;
}
.inner-service{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    margin-bottom: 10px;
    /* width: 100%; */
}
.inner-res{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    margin: 3px 25px;
    border-bottom: 2px solid white;
    padding: 5px 20px;
    padding-bottom: 0;
    /* width: 100%; */
}
.inner-res:nth-child(2) {
    border-top: 2px solid white;
}

/* .body-single:nth-child(2) {
    padding-bottom: 0;
} */
.services:nth-child(1) {
    padding-top: 0;
    border-top: none;
}
.common{
    padding: 4px;
    margin-right: 15px;
    /* background-color: #535252; */
    box-shadow: 1px 1px 1px black;
}

</style>