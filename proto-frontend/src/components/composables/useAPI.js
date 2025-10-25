import { ref } from 'vue'

export const useAPI = (factory) => {
  const isLoading = ref(false)
  const result = ref(null)
  const error = ref(null)

  const exec = async (...args) => {
    isLoading.value = true
    error.value = null

    try {
      result.value = await factory(...args)
    } catch (e) {
      error.value = e
      result.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    result,
    error,
    exec
  }
}
