<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🎵 Recomendador de Canciones</h1>

    <input
      v-model="searchQuery"
      @input="filterSongs"
      placeholder="Buscar canción..."
      class="w-full p-2 border rounded mb-4"
    />

    <ul class="max-h-60 overflow-y-auto border p-2 rounded mb-4">
      <li
        v-for="song in filteredSongs"
        :key="song.track_id"
        class="hover:bg-gray-100 p-2 cursor-pointer"
        @click="selectSong(song)"
      >
        {{ song.name }} - {{ song.artist }}
      </li>
    </ul>

    <div v-if="selectedSong">
      <p class="mb-2">
        🎧 Seleccionado: <strong>{{ selectedSong.name }}</strong> - {{ selectedSong.artist }}
      </p>

      <label class="block mb-2">
        Número de recomendaciones:
        <input v-model.number="k" type="number" min="1" class="ml-2 p-1 border rounded w-16" />
      </label>

      <button
        @click="searchSimilar"
        class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Buscar canciones similares
      </button>
    </div>

    <div v-if="similarTracks.length" class="mt-6">
      <h2 class="text-lg font-semibold mb-2">🎯 Recomendaciones:</h2>
      <ul>
        <li v-for="track in similarTracks" :key="track.track_id">
          {{ track.name }} - {{ track.artist }}
        </li>
      </ul>
    </div>

    <div v-if="loading" class="text-gray-600 mt-4">🔄 Cargando canciones...</div>
    <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const searchQuery = ref('')
const songs = ref([])
const filteredSongs = ref([])
const selectedSong = ref(null)
const k = ref(5)
const similarTracks = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/data/songs')
    songs.value = res.data
    filteredSongs.value = res.data
  } catch (err) {
    error.value = '❌ Error al cargar canciones.'
  } finally {
    loading.value = false
  }
})

const filterSongs = () => {
  const q = searchQuery.value.toLowerCase()
  filteredSongs.value = songs.value.filter(song =>
    song.name.toLowerCase().includes(q)
  )
}

const selectSong = (song) => {
  selectedSong.value = song
  searchQuery.value = `${song.name} - ${song.artist}`
  filteredSongs.value = []
  similarTracks.value = []
}

const searchSimilar = async () => {
  const { name, artist } = selectedSong.value
  try {
    const res = await axios.get('http://localhost:8000/recommend/track', {
      params: {
        artist,
        track: name,
        k: k.value
      }
    })
    similarTracks.value = res.data
  } catch (err) {
    error.value = '❌ Error al obtener recomendaciones.'
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

input[type="text"],
input[type="number"] {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 1rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

li {
  padding: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

li:hover {
  background-color: #f3f4f6;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 0.5rem;
}

button:hover {
  background-color: #2563eb;
}

.recommendations {
  margin-top: 2rem;
}

.recommendations h2 {
  margin-bottom: 0.75rem;
  color: #111827;
}
</style>
