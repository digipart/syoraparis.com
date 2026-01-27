<template>
  <div>
    <span @click="visible = true" class="cursor-pointer underline text-xs">
      {{ $t('label.trackMyDelivery') }}
    </span>
    <BaseDrawer
      v-model="visible"
      size="100%"
      maxSize="600px"
      position="right"
      :closeButton="false"
      class="sideMenu-drawer"
      bodyPadding="0px"
    >
      <div v-if="tracking" class="tracking-container">
        <!-- Header -->
        <div class="tracking-header">
          <div>
            <h2 class="tracking-title">
              {{ $t('label.trackingDetails') }}
            </h2>
            <p class="tracking-subtitle">
              {{ tracking.Tracking.Number }}
            </p>
          </div>
          <button @click="visible = false" class="tracking-close-btn">
            <IconX class="w-6 h-6" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="tracking-content">
          <div>
            <a
              :href="order?.Shipping?.Tracking?.URL"
              target="_blank"
              class="block mb-3.5 block"
            >
              <BaseButton
                class="uppercase block w-full"
                type="primary"
                plain
                size="small"
              >
                <span class="flex justify-center gap-2">
                  {{
                    $t('label.trackMyDeliveryOnThe', {
                      carrier: order?.Carrier?.Name,
                    })
                  }}
                </span>
                <template #iconRight>
                  <IconExternalLink :size="1.8" />
                </template>
              </BaseButton>
            </a>
            <hr class="my-5" />
          </div>
          <!-- Timeline -->
          <div class="timeline">
            <div
              v-for="(event, index) in tracking.Events"
              :key="index"
              class="timeline-item"
            >
              <!-- Timeline Dot -->
              <span
                class="timeline-dot"
                :class="index === 0 ? 'active' : 'inactive'"
              ></span>

              <!-- Content -->
              <div class="flex flex-col">
                <span class="timeline-date">
                  {{ formatDate(event.Date) }}
                </span>
                <h3 class="timeline-label" :class="{ active: index === 0 }">
                  {{ event.Label }}
                </h3>
                <div v-if="event.Site" class="timeline-location">
                  <!-- <span class="mr-1">📍</span> -->
                  {{ event.Site.Name }}
                  <span v-if="event.Site.Postcode"
                    >({{ event.Site.Postcode }})</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import OrderService from '~/services/OrderService';
import type { OrderTrackingType } from '~/types/OrderTrackingType';
import type { OrderType } from '~/types/OrderType';
const { order } = defineProps<{
  order: OrderType;
}>();

const visible = ref(false);

const orderService = new OrderService();

const tracking = ref<OrderTrackingType | null>(null);

const { locale } = useI18n();

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const fetchTracking = async () => {
  try {
    // if (!order?.IdOrder) return;
    // const data = await orderService.fetchOrderTrackingById({
    //   idOrder: order?.IdOrder,
    //   languageIsoCode: locale.value,
    // });
    // tracking.value = data;
    //  Mocked response as per user request
    const mockResponse = {
      Tracking: {
        Number: '7R00486500704',
        URL: 'https://www.laposte.fr/outils/suivre-vos-envois?code=7R00486500704',
        State: {
          Code: 2,
          Label: 'Exp\u00e9di\u00e9e',
        },
      },
      OrderCarrier: {
        Id: 129152,
        TrackingNumber: '7R00486500704',
        ShipmentType: 0,
      },
      Order: {
        Id: 'bee15289-cffc-3ae8-ab2a-80ee68e74b2c',
        Name: '10104679288127',
        Date: '2026-01-07 18:46:39',
      },
      Customer: {
        Firstname: 'Birgit',
        Lastname: 'Dede',
        MobilePhone: null,
        Email: 'fey.b@web.de',
      },
      Carrier: {
        Id: 816,
        Name: 'Colissimo',
      },
      Events: [
        {
          Date: '2026-01-21T11:40:18.420',
          Code: 'LIVCFM',
          Label: 'Votre colis est livr\u00e9.',
          Site: {
            Name: 'PARIS ESPACE LOG URBAIN LOUVRE',
            Code: '085701',
            Postcode: '75001',
          },
        },
        {
          Date: '2026-01-21T08:15:39.092',
          Code: 'PRELIV',
          Label:
            'Votre colis est sur son site de distribution. Nous le pr\u00e9parons pour le mettre en livraison.',
          Site: {
            Name: 'PARIS ESPACE LOG URBAIN LOUVRE',
            Code: '085701',
            Postcode: '75001',
          },
        },
        {
          Date: '2026-01-16T23:20:13.000',
          Code: 'PCHPIS',
          Label: 'Votre colis est en transit sur nos plateformes logistiques.',
          Site: {
            Name: 'GENNEVILLIERS PFMA',
            Code: '270542',
            Postcode: '92230',
          },
        },
        {
          Date: '2026-01-16T23:19:07.000',
          Code: 'AARCFM',
          Label:
            'Votre Colissimo est en cours de traitement sur le site de tri local.',
          Site: {
            Name: 'GENNEVILLIERS PFMA',
            Code: '270542',
            Postcode: '92230',
          },
        },
        {
          Date: '2026-01-16T18:21:48.000',
          Code: 'PCHIND',
          Label: 'Votre colis est en transit sur nos plateformes logistiques.',
          Site: {
            Name: 'LE THILLAY PFC',
            Code: '053628',
            Postcode: '95500',
          },
        },
        {
          Date: '2026-01-16T06:35:00.000',
          Code: 'MLVIMP',
          Label:
            'Votre colis est pr\u00eat \u00e0 quitter le territoire \u00e9tranger. Il va \u00eatre remis au transporteur pour son acheminement vers la France.',
          Site: {
            Name: 'ALLEMAGNE',
            Code: '990001',
            Postcode: '00000',
          },
        },
        {
          Date: '2026-01-14T15:16:00.000',
          Code: 'DEPIMP',
          Label:
            "Votre colis a \u00e9t\u00e9 d\u00e9pos\u00e9 par l'exp\u00e9diteur chez notre partenaire postal dans son pays d'origine.",
          Site: {
            Name: 'ALLEMAGNE',
            Code: '990001',
            Postcode: '00000',
          },
        },
        {
          Date: '2026-01-09T10:04:58.000',
          Code: 'PCHMQT',
          Label:
            'Votre Colissimo va bient\u00f4t nous \u00eatre confi\u00e9 ! Il est en cours de pr\u00e9paration chez votre exp\u00e9diteur.',
          Site: {
            Name: 'VENTE ON LINE',
            Code: '009910',
            Postcode: '92130',
          },
        },
      ],
    };

    tracking.value = mockResponse;
  } catch (error) {
    console.error(error);
  }
};
onMounted(() => {
  fetchTracking();
});
</script>

<style lang="scss" scoped>
.tracking-container {
  @apply h-full flex flex-col bg-white;
}

.tracking-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-100;
}

.tracking-title {
  @apply text-xl font-bold text-gray-900;
}

.tracking-subtitle {
  @apply text-sm text-gray-500 mt-1;
}

.tracking-close-btn {
  @apply p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors;
}

.tracking-content {
  @apply flex-1 overflow-y-auto p-6;
}

.timeline {
  @apply relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2;
}

.timeline-item {
  @apply relative pl-6;
}

.timeline-dot {
  @apply absolute left-[-25px] top-1 h-4 w-4 rounded-full border-2 border-white ring-1 ring-gray-100;

  &.active {
    @apply bg-black ring-black;
  }

  &.inactive {
    @apply bg-gray-300;
  }
}

.timeline-date {
  @apply text-xs text-gray-600 tracking-wider mb-1;
}

.timeline-label {
  @apply text-sm font-medium text-gray-900 leading-snug mb-1;

  &.active {
    @apply text-black font-bold;
  }
}

.timeline-location {
  @apply flex items-center text-xs text-gray-600;
}
</style>
