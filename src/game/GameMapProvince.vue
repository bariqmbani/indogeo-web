<script setup lang="ts">
import LeafletGeoJsonTemplate from '@/components/LeafletGeoJsonTemplate.vue'
import indonesiaProvince from '@/assets/indonesia-province.json'
import { computed, onMounted, ref } from 'vue'
import { gameStore, type GameQuestion } from '@/game/Game'
import Start from '@/components/Start.vue'
import GameQuestionCard from './GameQuestionCard.vue'

const geojson = indonesiaProvince as GeoJSON.FeatureCollection

const mapOptions = computed<L.MapOptions>(() => ({
  zoomSnap: 0.1,
  dragging: true,
  minZoom: 5,
  maxBoundsViscosity: 1,
  fadeAnimation: true,
  zoomAnimation: true,
}))

const fitBoundsOptions = computed<L.FitBoundsOptions>(() => ({
  animate: true,
  maxZoom: 8,
}))

const questions = ref<GameQuestion[]>([])

onMounted(() => {
  questions.value = geojson.features
    .filter((feature) => {
      return feature.properties?.code != null && feature.properties?.name != null
    })
    .map((feature) => {
      return {
        code: feature.properties?.code,
        name: feature.properties?.name,
      }
    })
})
</script>

<template>
  <Start v-if="!gameStore.isOngoing()" :question-data="questions" />
  <GameQuestionCard v-else />
  <div class="map-container">
    <LeafletGeoJsonTemplate :geojson :map-options :fit-bounds-options />
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  position: absolute;
  height: 100vh;
  z-index: 0;
}
</style>
