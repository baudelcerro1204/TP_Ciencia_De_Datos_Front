<template>
  <div class="main-container">
    <div class="left-panel">
      <div class="modern-title">
        <span class="icon">🎵</span>
        <span>Recomendador de <span class="highlight">Canciones</span></span>
      </div>
      <div class="modern-search">
        <input
          v-model="searchQuery"
          @input="filterSongs"
          placeholder="Buscar canción o artista..."
          class="modern-input"
        />
      </div>
      <ul class="song-list">
        <li
          v-for="song in filteredSongs"
          :key="song.track_id"
          class="hover:bg-gray-100 p-2 cursor-pointer"
          @click="selectSong(song)"
        >
          {{ song.name }} - {{ song.artist }}
        </li>
      </ul>
      <div v-if="loading" class="text-gray-600 mt-4">🔄 Cargando canciones...</div>
      <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
    </div>

    <div class="right-panel">
      <div v-if="selectedSong" class="song-details">
        <p class="mb-2">
          🎧 Seleccionado: <strong>{{ selectedSong.name }}</strong> - {{ selectedSong.artist }}
        </p>
        <label class="block mb-4 modern-label">
          Número de recomendaciones:
          <input
            v-model.number="k"
            type="number"
            min="1"
            class="modern-input modern-input-number"
          />
        </label>
        <button
          @click="searchSimilar"
          class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
        >
          Buscar canciones similares
        </button>
      </div>

      <div v-if="similarTracks.length" class="recommendations mt-6">
        <h2 class="text-lg font-semibold mb-2">🎯 Recomendaciones:</h2>
        <ul>
          <li v-for="track in similarTracks" :key="track.track_id">
            {{ track.name }} - {{ track.artist }}
          </li>
        </ul>
      </div>
    </div>
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
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.main-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f9f9f9;
}

.left-panel {
  flex: 1 1 50%;
  height: 100vh;
  padding: 3rem 2rem;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  background: #fff;
  min-width: 0;
  max-width: none;
}

.right-panel {
  flex: 1 1 50%;
  height: 100vh;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: #fff;
  overflow-y: auto;
  min-width: 0;
  max-width: none;
}

.song-list {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem;
  background: #f9fafb;
  margin-bottom: 1rem;
  min-height: 0;
  max-height: 70vh;
}

.song-details,
.recommendations {
  background: #f4f6fb;
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(37,99,235,0.08);
  padding: 2rem 2rem 1.5rem 2rem;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.song-details label {
  font-weight: 500;
  color: #22223b;
}

button {
  background: linear-gradient(90deg, #2563eb 60%, #3b82f6 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.7rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.08);
  transition: background 0.2s, transform 0.1s;
}

button:hover {
  background: linear-gradient(90deg, #1d4ed8 60%, #2563eb 100%);
  transform: translateY(-2px) scale(1.03);
}

.recommendations h2 {
  color: #22223b;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.recommendations ul {
  padding-left: 1rem;
}

.recommendations li {
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 1rem;
}

.modern-title {
  display: flex;
  align-items: center;
  font-size: 2.1rem;
  font-weight: 700;
  color: #22223b;
  margin-bottom: 2.2rem;
  gap: 0.7rem;
  letter-spacing: -1px;
}

.modern-title .icon {
  font-size: 2.3rem;
  color: #2563eb;
  filter: drop-shadow(0 2px 6px #2563eb33);
}

.modern-title .highlight {
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0;
}

.modern-search {
  width: 100%;
  margin-bottom: 1.5rem;
}

.modern-input {
  width: 100%;
  padding: 0.85rem 1.2rem;
  border-radius: 14px;
  border: none;
  background: #f4f6fb;
  font-size: 1.08rem;
  box-shadow: 0 2px 12px 0 rgba(37,99,235,0.07);
  transition: box-shadow 0.2s, background 0.2s;
  outline: none;
}

.modern-input:focus {
  background: #fff;
  box-shadow: 0 4px 18px 0 rgba(37,99,235,0.13);
  border: 1.5px solid #2563eb;
}

.modern-label {
  font-weight: 500;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.modern-input-number {
  width: 80px;
  margin-left: 0.7rem;
  padding: 0.7rem 0.8rem;
  font-size: 1.08rem;
  border-radius: 12px;
  border: none;
  background: #f4f6fb;
  box-shadow: 0 2px 12px 0 rgba(37,99,235,0.07);
  transition: box-shadow 0.2s, background 0.2s;
  outline: none;
}

.modern-input-number:focus {
  background: #fff;
  box-shadow: 0 4px 18px 0 rgba(37,99,235,0.13);
  border: 1.5px solid #2563eb;
}

@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }
  .left-panel, .right-panel {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
    height: auto;
  }
  .right-panel {
    padding: 1rem;
  }
}
</style>
