<script lang="ts" setup>
import { gameStore, type GameQuestion } from '@/game/Game'

const props = defineProps<{
  questionData: GameQuestion[]
}>()

function startGame() {
  gameStore.initGame(props.questionData)
}
</script>

<template>
  <div class="blur">
    <button class="btn-start" v-on:click="startGame">kuy</button>
  </div>
</template>

<style lang="css" scoped>
.blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0.5px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}

.btn-start {
  background-color: var(--color-primary);
  color: whitesmoke;
  border: none;
  padding: 1rem 3rem;
  font-size: 2rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  position: absolute;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-transform: uppercase;
  letter-spacing: 5px;
}

.btn-start:hover {
  background-color: var(--color-primary-light);
}
</style>
