<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <button class="modal-close" @click="closeModal">✖</button>
      <h3 class="font-semibold mb-3">🎤 Ingresar nueva canción con features</h3>

      <label class="block mb-2 modern-label">Nombre de la canción:</label>
      <input
        v-model="newSong.name"
        type="text"
        placeholder="Nombre de la canción"
        class="modern-input"
        required
      />

      <label class="block mb-2 modern-label">Artista:</label>
      <input
        v-model="newSong.artist"
        type="text"
        placeholder="Nombre del artista"
        class="modern-input"
        required
      />

      <label class="block mb-2 modern-label">Género:</label>
      <select v-model="newSong.genre" class="modern-input" required>
        <option value="" disabled>Selecciona un género</option>
        <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
      </select>

      <div v-for="feat in requiredFeatures" :key="feat" class="mt-3">
        <label class="block modern-label">{{ featLabels[feat] || feat }}:</label>
        <input
          v-if="feat !== 'duration'"
          v-model.number="newSong[feat]"
          type="number"
          step="any"
          min="0"
          class="modern-input"
          required
        />
        <input
          v-else
          v-model="newSong.duration"
          type="text"
          placeholder="mm:ss o segundos"
          class="modern-input"
          required
        />
      </div>

      <h4 class="mt-4 font-semibold">Campos opcionales</h4>
      <div v-for="opt in optionalFeatures" :key="opt" class="mt-2">
        <label class="block modern-label">{{ featLabels[opt] || opt }}:</label>
        <input
          v-model="newSong[opt]"
          type="text"
          placeholder="(opcional)"
          class="modern-input"
        />
      </div>

      <button @click="submitNewSong" class="btn-primary mt-4">
        Obtener recomendaciones
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { defineEmits } from 'vue'

const emit = defineEmits(['close', 'new-recommendations'])

const genres = ref([])
const error = ref(null)
const loading = ref(false)
const similarTracks = ref([])

const requiredFeatures = [
  'danceability', 'energy',
  'acousticness', 'instrumentalness', 'speechiness',
  'loudness', 'duration'
]

const optionalFeatures = [
  'popularity', 'liveness', 'speechiness_alt'
]

const featLabels = {
  duration: 'Duración (mm:ss)',
}

const newSong = ref({
  name: '',
  artist: '',
  genre: '',
  duration: '',       
  danceability: null,
  energy: null,
  loudness: null,
  speechiness: null,
  acousticness: null,
  instrumentalness: null,
  liveness: null
})


// Función para convertir duración en "mm:ss" o segundos a minutos como número decimal
const parseDurationToMinutes = (dur) => {
  if (!dur) return 0
  if (typeof dur === 'number') return dur
  if (typeof dur === 'string') {
    if (dur.includes(':')) {
      const parts = dur.split(':')
      if (parts.length === 2) {
        const min = parseInt(parts[0], 10)
        const sec = parseInt(parts[1], 10)
        if (!isNaN(min) && !isNaN(sec)) {
          return min + sec / 60
        }
      }
    }
    const sec = parseFloat(dur)
    if (!isNaN(sec)) return sec / 60
  }
  return 0
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/genre/list')
    genres.value = res.data
  } catch {
    genres.value = []
  } finally {
    loading.value = false
  }
})

const closeModal = () => {
  emit('close')
}

const submitNewSong = async () => {
  error.value = null
  similarTracks.value = []

  // Validar nombre y artista
  if (!newSong.value.name || !newSong.value.artist) {
    error.value = 'Por favor completa el nombre de la canción y el artista.'
    return
  }

  // Validar campos obligatorios features
  for (const f of requiredFeatures) {
    if (newSong.value[f] === null || newSong.value[f] === '') {
      error.value = `Por favor completa el campo obligatorio: ${featLabels[f] || f}`
      return
    }
  }
  if (!newSong.value.genre) {
    error.value = 'Por favor selecciona un género.'
    return
  }

  // Construir payload sin campos vacíos
  const payload = {}
  for (const [key, value] of Object.entries(newSong.value)) {
    if (value !== '' && value !== null) {
      payload[key] = value
    }
  }

  // Parsear duración a minutos decimal
  payload.duration = parseDurationToMinutes(newSong.value.duration)

  // Asegurar incluir name y artist bien formateados
  payload.name = newSong.value.name.trim()
  payload.artist = newSong.value.artist.trim()

  try {
    const res = await axios.post('http://localhost:8000/recommend/track/features', payload, {
      params: { k: 5 }
    })
    similarTracks.value = res.data
    emit('new-recommendations', res.data)
  } catch (e) {
    error.value = '❌ Error al obtener recomendaciones.'
    console.error(e)
  }
}
</script>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem; /* para que no quede pegado a bordes en pantallas chicas */
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh; /* para que no ocupe más del 80% de alto de pantalla */
  overflow-y: auto; /* scroll vertical interno si es necesario */
  position: relative;
  box-sizing: border-box;
}

.modal-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
  margin: 1rem auto 0;
  display: block;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.modern-label {
  font-weight: 500;
  color: #22223b;
  display: flex;
  align-items: center;
  gap: 0.7rem;
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
  box-sizing: border-box;
  margin-bottom: 0.8rem;
}

.modern-input:focus {
  background: #fff;
  box-shadow: 0 4px 18px 0 rgba(37,99,235,0.13);
  border: 1.5px solid #2563eb;
}
</style>
