<template>
    <div class="outerCal">
        <VCalendar borderless />
        <!-- <VDatePicker /> -->
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    data() {
        return {
            date: new Date(),
        }
    },
    // methods: {
    //     currdate({ date }) {
    //         if (this.isToday(date)) {
    //             return 'pink'; // You can return any color you wish here
    //         }
    //         return undefined; // Default color
    //     },
    //     isToday(date) {
    //         const today = new Date();
    //         return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()
    //     }
    // }
}
</script>

<style>
.outerCal {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.today {
    border: 1px solid #000;
    border-radius: 5px;
    background-color: rgb(175, 209, 239);
    color: #000;
}
</style>