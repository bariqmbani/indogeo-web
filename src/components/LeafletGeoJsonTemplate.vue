<script lang="ts" setup>
import { onMounted, withDefaults, defineProps, readonly, computed, ref } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { gameStore, type GameAnswer } from '@/game/Game'

interface Props {
  geojson: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[]
  mapOptions?: L.MapOptions
  fitBoundsOptions?: L.FitBoundsOptions
  latPadding?: number
  lngPadding?: number
}

const props = withDefaults(defineProps<Props>(), {
  mapOptions: () => ({}),
  fitBoundsOptions: () => ({}),
  latPadding: 0.5,
  lngPadding: 0.5,
})

// define the defaults separately
// because I want customizing the default options,
// not using the leaflet's default.
// see https://leafletjs.com/reference.html for more options description
const defaultMapOptions: L.MapOptions = readonly({
  // attributionControl is something like watermark, it will be displayed in the bottom-right corner
  attributionControl: false,

  // to allow map drag
  dragging: true,

  // zoom button inside the map
  zoomControl: false,

  // zoom in when double click the map
  doubleClickZoom: false,

  // to allow zoom using Shift key and box selection using mouse drag
  boxZoom: false,

  // forces the map's zoom level to always be a multiple of this, particularly right after a fitBounds()
  zoomSnap: 0.01,

  // if true, when window size change, the current view will remain in the center of the map
  trackResize: true,

  // add inertia when the map is being dragged
  inertia: false,

  // control how solid the bounds are when dragging the map around
  maxBoundsViscosity: 100,

  fadeAnimation: false,

  zoomAnimation: false,

  markerZoomAnimation: false,
})

// merge defaults with any user-provided options
const mapOptions = computed(() => {
  return { ...defaultMapOptions, ...props.mapOptions }
})

const map = ref<L.Map>()

onMounted(() => {
  map.value = L.map('map', mapOptions.value)

  function onEachFeature(
    feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, GeoJSON.GeoJsonProperties>,
    layer: L.Layer,
  ) {
    // bind the event to the feature layer
    layer.on({
      click: (e) => {
        console.debug(feature.properties)
        const answer: GameAnswer = {
          code: feature.properties!.code,
          name: feature.properties!.name,
          feature: feature!,
          event: e,
        }
        gameStore.evaluateAnswer(answer)
      },

      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.8,
        })
      },

      mouseout: (e) => {
        e.target.setStyle({
          fillOpacity: 0.4,
        })
      },
    })
  }

  function style(feature?: GeoJSON.Feature): L.PathOptions {
    let fillColor = 'white'
    if (feature?.properties && feature.properties.fillColor) {
      fillColor = feature.properties.fillColor
    }

    // fillColor and fillOpacity is for the background color
    // any property without 'fill' is for the line border
    return {
      fillColor,
      fillOpacity: 0.4,
      weight: 0.3,
      opacity: 0.3,
      color: 'black',
    }
  }

  const provinceLayer = L.geoJSON(props.geojson as GeoJSON.FeatureCollection, {
    onEachFeature,
    style,
  })
  provinceLayer.addTo(map.value)

  const indonesiaBounds = provinceLayer.getBounds()

  // // customizing maxBounds
  // // instead using indonesia's bound from the geojson data
  // // add padding when the map zoomed in
  // const PADDING_LAT = props.latPadding
  // const PADDING_LNG = props.lngPadding
  // const maxBounds = L.latLngBounds(
  //   {
  //     lat: indonesiaBounds.getSouth() - 4,
  //     lng: indonesiaBounds.getWest() - 0,
  //   },
  //   {
  //     lat: indonesiaBounds.getNorth() + 4,
  //     lng: indonesiaBounds.getEast() + 0,
  //   },
  // )

  map.value.setMaxBounds(indonesiaBounds)
  map.value.fitBounds(indonesiaBounds, props.fitBoundsOptions)
})
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  min-height: 700px;
}

/* disable map focus outline, leaflet css default black outline */
#map:focus {
  outline: none;
}
</style>
