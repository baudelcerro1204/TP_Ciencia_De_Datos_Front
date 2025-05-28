<template>
  <div>
    <h2 class="mb-3">🎵 Canciones en el Dataset</h2>
    <div v-if="loading">Cargando canciones...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul class="list-group">
      <li class="list-group-item" v-for="song in songs" :key="song.track_id">
        <strong>{{ song.name }}</strong> — {{ song.artist }} ({{ song.genre }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const songs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8000/songs')  // URL de tu backend
    songs.value = res.data
  } catch (err) {
    error.value = '❌ Error al cargar canciones.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.list-group-item {
  font-family: 'Segoe UI', sans-serif;
}
</style>
