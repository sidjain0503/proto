<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function handleLogin() {
  loading.value = true
  error.value = ''
  // Simulate login delay; replace with real API call as needed
  setTimeout(() => {
    loading.value = false
    if (username.value === 'admin' && password.value === 'admin') {
      error.value = ''
      // Redirect or trigger success event here
    } else {
      error.value = 'Invalid username or password'
    }
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-stretch">
    <!-- Branding Section -->
    <div class="hidden md:flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-12">
      <div class="mb-8">
        <img src="../../../assets/proto-logo.png" alt="Proto Logo" class="w-32 h-32 object-contain mb-4" />
      </div>
      <h1 class="text-4xl font-extrabold text-blue-900 mb-2">Proto!</h1>
      <div class="text-xl text-blue-900/80 font-medium max-w-xs text-center">
        Your RAG Assistant is here..
      </div>
    </div>

    <!-- Login Section -->
    <div class="flex flex-col justify-center flex-1 bg-white px-8 py-12 max-w-md w-full mx-auto">
      <h2 class="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign In</h2>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <span class="p-input-icon-left">
          <i class="pi pi-user" />
          <InputText
            v-model="username"
            placeholder="Username"
            class="w-full shadow-sm"
            autocomplete="username"
          />
        </span>
        <span class="p-input-icon-left relative">
          <i class="pi pi-lock" />
          <Password
            v-model="password"
            placeholder="Password"
            class="w-full shadow-sm"
            :feedback="false"
            toggleMask
            input-class="w-full shadow-sm pr-12" 
            autocomplete="current-password"
            :pt="{
              toggleicon: { class: 'absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500' },
              root: { class: 'relative w-full' },
            }"
          />
        </span>
        <Button
          type="submit"
          label="Login"
          class="w-full mt-2"
          :loading="loading"
        />
        <div v-if="error" class="text-red-600 text-center text-sm mt-2">
          {{ error }}
        </div>
      </form>
      <!-- Optional: Forgot password or Sign up -->
    </div>
  </div>
</template>