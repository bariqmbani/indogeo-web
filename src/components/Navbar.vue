<script lang="ts" setup>
// import { onMounted, ref, watch } from 'vue'
import { gameStore, timerStore } from '../game/Game'

// const currentMinutes = ref('00')
// const currentSeconds = ref('00')

// const durationId = ref<number>()

// onMounted(() => {
//   durationId.value = setInterval(() => {
//     if (!gameStore.startAt) {
//       return
//     }
//     const diff = Date.now() - gameStore.startAt
//     const minutes = Math.floor(diff / 1000 / 60)
//     const seconds = Math.floor((diff / 1000) % 60)
//     currentMinutes.value = minutes.toString().padStart(2, '0')
//     currentSeconds.value = seconds.toString().padStart(2, '0')
//   }, 1000)
// })

// watch(gameStore, () => {
//   if (!gameStore.isOngoing()) {
//     clearInterval(durationId.value)
//   }
// })
</script>

<template>
  <nav class="navbar">
    <div class="title">
      <h1>Provinsi di Indonesia</h1>
    </div>
    <div class="content">
      <ul>
        <li>
          Pertanyaan: {{ gameStore.currentQuestionCount }} dari {{ gameStore.totalQuestionCount }}
        </li>
        <li>Skor: {{ gameStore.score }}</li>
        <li>Waktu: {{ timerStore.timer }}</li>
      </ul>
    </div>
  </nav>
</template>

<style lang="css" scoped>
.navbar {
  font-size: 1.3rem;
  background-color: var(--color-primary);
  color: whitesmoke;
  width: 100%;
  max-width: 100%;
  height: 100px;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 20px;
}

.navbar ul {
  list-style: none;
  margin: 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.navbar ul li {
  padding: 10px;
}

.navbar .title {
  padding: 0 20px;
  min-width: fit-content;
}

.navbar .content {
  width: 100%;
}

/* switch to 1 column layout at ≤900px */
@media (max-width: 900px) {
  .navbar {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: fit-content;
    text-align: center;
    font-size: 1.2rem;
  }

  .navbar .title,
  .navbar .content {
    padding: 0px 0;
  }

  .navbar ul {
    justify-content: space-between;
  }

  .navbar h1 {
    margin: 20px 0 0 0;
  }
}
</style>
