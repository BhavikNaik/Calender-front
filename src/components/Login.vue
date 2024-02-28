<template>
   <div class="maincontent">
    <div class="content">
         <div class="text">
            Login Form
         </div>
         <form v-on:submit.prevent="submitForm">
            <div class="field">
               <input type="text" v-model="mail" id="mail" placeholder="Email Id">
               <span class="fas fa-envelope"></span>
            </div>
            <div class="field">
               <input type="password" v-model="password" id="password" placeholder="Password">
               <span class="fas fa-lock"></span>
            </div>
            <!-- <div class="forgot-pass">
               <a href="#">Forgot Password?</a>
            </div> -->
            <input type="submit" value="Sign In" id="login">
            <div class="sign-in">
               Don't have an account?
               <router-link to="/">Register</router-link>
            </div>
         </form>
      </div>
   </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

    export default {
      data() {
         return {
            mail: '',
            password: '',
            emailError: false,
            passwordError: false,
         };
      },
      methods: {
         validateEmail() {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(!emailRegex.test(this.mail)) {
               //alert('Invalid email address');
               this.emailError=false;
            } else{
               this.emailError=true;
            }
         },
         validatePassword() {
            if(this.password.length < 6) {
               //alert('Password must be at least 6 characters');
               this.passwordError=false;
            } else{
               this.passwordError=true;
            }
         },
         triggerToast() {
            const toast = useToast();
            
            toast("Login Successful !!", {
            position: "bottom-right",
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            hideProgressBar: true,
            closeButton: "button",
            icon: "far fa-thumbs-up",
            rtl: false
            });
         },
         async loginCheck() {
            // if(this.emailError || this.passwordError) {
            //    return;
            // }
            try {
               const response = await axios.post(`http://localhost:3000/auth/login`, {
                  email: this.mail,
                  password: this.password,
               },{  withCredentials: true })
               //const data = await response.data;
               console.log(response.data);
               //if (response.data.success) {
               // Store email in cookie
               // this.$cookies.set('email', response.data.email, { expires: '1d' });
               this.triggerToast();
               
               this.$router.push('/aghome');
            } catch (e) {
               console.log(e)
            }
         },

         submitForm() {
            this.validateEmail();
            this.validatePassword();

            if (!this.emailError) {
               alert('Invalid email address');
               return;
            }

            if (!this.passwordError) {
               alert('Password must be at least 6 characters');
               return;
            }

            // console.log(this.mail, "", this.password);

            this.loginCheck();
            //this.$router.push('/home');
            
         },
      },
    }
</script>

<style scoped>

</style>