
<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <button class="modal-close" @click="closeModal">✖</button>
      <h3 class="font-semibold mb-3">🎧 Agregar canción automáticamente</h3>
      <label class="block mb-2 modern-label">Canción - Artista:</label>
      <input
        v-model="trackInput"
        type="text"
        placeholder="Ej: Smells Like Teen Spirit - Nirvana"
        class="modern-input"
      />
      <button @click="submitTrackName" class="btn-primary mt-4">
        Agregar
      </button>
      <p v-if="trackError" class="text-red-500 mt-2">{{ trackError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { defineEmits } from 'vue'

const emit = defineEmits(['close', 'new-recommendations'])

const trackInput = ref('')
const trackError = ref(null)

const closeModal = () => {
  emit('close')
}

const submitTrackName = async () => {
  trackError.value = null

  if (!trackInput.value.includes('-')) {
    trackError.value = '⚠️ Usá el formato "Canción - Artista"'
    return
  }

  try {
    const res = await axios.post('http://localhost:8000/data/add_by_name', {
      name: trackInput.value.trim()
    }, {
      params: { k: 5 }
    })
    emit('new-recommendations', res.data.recommendations || [])
  } catch (err) {
    trackError.value = '❌ No se pudo agregar la canción.'
    console.error(err)
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
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
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
