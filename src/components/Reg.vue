<template>
   <div class="maincontent">
      <div class="content">
         <div class="text">
            Registration Form
         </div>
         <form v-on:submit.prevent="submitForm">
            <div class="field">
               <input type="text" v-model="name" id="name" placeholder="Name" >
               <!-- <div>{{ name }}</div> -->
               <span class="fas fa-user"></span>
            </div>
            <div class="field">
               <input type="text" v-model="mail" id="mail" placeholder="Email Id">
               <span class="fas fa-envelope"></span>
            </div>
            <div class="field">
               <input type="password" v-model="password" id="password" placeholder="Password">
               <span class="fas fa-lock"></span>
            </div>
            <div class="field">
               <input type="password" v-model="confpassword" id="confpassword" placeholder="Confirm Password">
               <span class="fas fa-lock"></span>
            </div>

            <input type="submit" value="Sign Up" id="register">
            <div class="sign-up">
               Already have an account?
               <router-link to="/login">Login</router-link>
            </div>
         </form>
      </div>
   </div>
</template>

<script>
   import axios from "axios";

    export default {
      data() {
         return {
            name: '',
            mail: '',
            password: '',
            confpassword: '',
            nameError: false,
            emailError: false,
            passwordError: false,
            confpasswordError: false,
         };
      },
      methods: {
         validateName() {
            if(this.name.length < 1) {
               //alert('Name is required');
               this.nameError=false;
            } else{
               this.nameError=true;
            }
         },
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
         validateConfirmPassword() {
            if(this.password !== this.confpassword) {
               //alert('Passwords must match');
               this.confpasswordError=false;
            } else{
               this.confpasswordError=true;
            }
         },
         // async checkMail(){
         //    const response = await axios.get('http://localhost:5000/register');
         //    const registeredEmails = response.data;
         //    if(registeredEmails.includes(this.mail)){
         //       this.emailError=false;
         //       return;
         //    } else{
         //       this.emailError=true;
         //    }
         // },

         async register(){
            try {
               const res = await axios.post(`http://localhost:3000/auth/signup`, {
                  //name: this.name,
                  email: this.mail,
                  password: this.password,
                  name: this.name
               })
               console.log(this.mail," ",this.password)
               console.log(res.data)
               if(res.data.message === "Account created"){
                  this.$router.push('/login')
               }else if(res.data.message === "User Exists"){
                  this.$router.push('/')
                  console.log("Already existssss")
               }else{
                  this.$router.push('/')
               }
            } catch (e) {
               console.log(e)
            }
         },
         submitForm() {
            // Validate before submitting
            this.validateName();
            this.validateEmail();
            this.validatePassword();
            this.validateConfirmPassword();
            
            // if (this.nameError || this.emailError || this.passwordError || this.confpasswordError) {
            //    console.log('Form has errors. Please fix them before submitting.');
            //    //alert(this.alertMessage);
            //    return;
            // }

            // if (!this.nameError) {
            //    alert('Name is required');
            //    return;
            // }

            if (!this.emailError) {
               alert('Invalid email address or already taken');
               return;
            }

            if (!this.passwordError) {
               alert('Password must be at least 6 characters');
               return;
            }

            if (!this.confpasswordError) {
               alert('Passwords must match');
               return;
            }
            //this.checkMail();
            // console.log('Form submitted!');
            // console.log(this.name,"", this.mail, "", this.password, "", this.confpassword);
            this.register();

            
         },
      },
    }
</script>

<style scoped>

</style>