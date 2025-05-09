<script lang="ts" setup>
import { gameStore } from './Game'
</script>

<template>
  <div class="game-question-view">
    <div class="game-question-view-content">
      di mana <b>{{ gameStore.currentQuestion!.name }}?</b>
    </div>
  </div>
</template>

<style lang="css" scoped>
.game-question-view {
  width: 320px;
  align-items: center;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: var(--color-primary);
  border-radius: 0 0 1rem 1rem;
}

.game-question-view-content {
  font-size: 2rem;
  color: whitesmoke;
  text-align: center;
  padding: 10px 60px 30px 60px;
}

@media (max-width: 900px) {
  .game-question-view {
    top: 135px;
  }
  .game-question-view-content {
    font-size: 1.5rem;
    padding: 10px 20px 15px 20px;
  }
}
</style>
