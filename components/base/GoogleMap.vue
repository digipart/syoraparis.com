<template>
  <div class="h-full w-full aspect-square md:aspect-video">
    <div ref="mapContainer" class="h-full w-full"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const mapContainer = ref<HTMLElement | null>(null);
const config = useRuntimeConfig();

interface MarkerIcon {
  url: string;
  scaledSize?: { width: number; height: number };
}

interface CustomMarker {
  id: string | number;
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  clickable?: boolean;
  draggable?: boolean;
}

const props = defineProps<{
  center: { lat: number; lng: number };
  zoom: number;
  markers: CustomMarker[];
  selectedMarkerId?: string | number;
  useMonoTheme?: boolean;
}>();

const emit = defineEmits(['markerClick']);

let map: google.maps.Map | null = null;
let googleMarkers: google.maps.Marker[] = [];

// Define theme_mono style
const monoStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

const pins = computed(() => ({
  selected: {
    url: config.public.shopMapIcon || '/assets/images/map-marker-selected.png',
    scaledSize: { width: 40, height: 40 },
  },
  notSelected: {
    url: config.public.shopMapIcon || '/assets/images/map-marker-selected.png',
    scaledSize: { width: 20, height: 20 },
  },
}));

onMounted(async () => {
  const loader = new Loader({
    apiKey: 'AIzaSyB_B7f6Bvra8jlBCA7moWsNIPNgGJwqtvg',
    version: 'weekly',
  });

  const google = await loader.load();
  const { Map } = (await google.maps.importLibrary(
    'maps'
  )) as google.maps.MapsLibrary;

  map = new Map(mapContainer.value as HTMLElement, {
    center: props.center,
    zoom: props.zoom,
    // mapTypeId: 'terrain',
    styles: props.useMonoTheme ? monoStyle : [],
    // mapId: '5312d35bdc5059a9',
  });

  createMarkers();
});

watch(() => props.markers, createMarkers, { deep: true });
watch(() => props.selectedMarkerId, updateMarkerIcons);
watch(
  () => props.center,
  (newCenter) => {
    if (map) {
      map.setCenter(newCenter);
    }
  },
  { deep: true } // Ensure it detects changes in nested lat/lng objects
);

function createMarkers() {
  if (!map) return;

  googleMarkers.forEach((marker) => marker.setMap(null));
  googleMarkers = [];

  props.markers.forEach((marker) => {
    const googleMarker = new google.maps.Marker({
      position: marker.position,
      map,
      title: marker.title,
      clickable: marker.clickable ?? true,
      draggable: marker.draggable ?? false,
      icon: convertIcon(
        marker.id === props.selectedMarkerId
          ? pins.value.selected
          : pins.value.notSelected
      ),
    });

    googleMarker.addListener('click', () => emit('markerClick', marker));
    googleMarkers.push(googleMarker);
  });
}

function updateMarkerIcons() {
  googleMarkers.forEach((googleMarker, index) => {
    const marker = props.markers[index];
    googleMarker.setIcon(
      convertIcon(
        marker.id === props.selectedMarkerId
          ? pins.value.selected
          : pins.value.notSelected
      )
    );
  });
}

function convertIcon(icon: MarkerIcon): google.maps.Icon {
  return {
    url: icon.url,
    scaledSize: icon.scaledSize
      ? new google.maps.Size(icon.scaledSize.width, icon.scaledSize.height)
      : undefined,
  };
}

</script>
