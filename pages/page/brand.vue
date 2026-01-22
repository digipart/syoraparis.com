<template>
  <div class="brandPage">
    <section class="brandPage-hero">
      <NuxtImg
        class="brandPage-heroMedia"
        :src="content.hero.image"
        :alt="content.hero.alt"
      />
      <div class="brandPage-heroOverlay px-5 py-5 lg:py-10">
        <div class="sticky top-0 z-10 h-full max-h-screen">
          <div class="flex items-center h-full">
            <div class="sticky top-[calc(50%_-_0.5em_*_1.02)] z-30 max-w-xl">
              <BaseHeadLine name="h1" class="brandPage-heroTitle">
                {{ content.hero.title }}
              </BaseHeadLine>
              <p class="brandPage-heroSubtitle">
                {{ content.hero.subtitle }}
              </p>
              <BaseButton
                type="primary"
                size="large"
                class="mt-6 min-w-48"
                @click="scrollToNextSection"
              >
                {{ content.hero.buttonText || 'Découvrir' }}
              </BaseButton>
            </div>
          </div>
        </div>
        <div class="brandPage-scrollIndicator">
          <div class="brandPage-scrollArrow"></div>
          <div class="brandPage-scrollText">
            {{ content.hero.scrollText || 'Défiler' }}
          </div>
        </div>
      </div>
    </section>

    <section class="brandPage-story">
      <LayoutContainer>
        <div class="grid grid-cols-12 gap-5 lg:gap-28 items-center">
          <div class="col-span-12 lg:col-span-6 space-y-6 order-2 lg:order-1">
            <BaseHeadLine name="h2" size="xl" class="font-normal uppercase">
              {{ content.story.title }}
            </BaseHeadLine>
            <p
              v-for="(paragraph, index) in content.story.paragraphs"
              :key="`story-para-${index}`"
            >
              {{ paragraph }}
            </p>
            <div class="brandPage-highlights">
              <article
                v-for="highlight in content.highlights"
                :key="highlight.title"
              >
                <BaseHeadLine
                  size="sm"
                  class="font-medium uppercase text-white"
                >
                  {{ highlight.title }}
                </BaseHeadLine>
                <p>{{ highlight.description }}</p>
              </article>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6 order-1 lg:order-2">
            <div class="brandPage-storyMedia">
              <NuxtImg
                :src="content.story.image.src"
                :alt="content.story.image.alt"
              />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </section>

    <section class="brandPage-story">
      <LayoutContainer>
        <div class="grid grid-cols-12 gap-5 lg:gap-28 items-center">
          <div class="col-span-12 lg:col-span-6 order-1 lg:order-1">
            <div class="brandPage-storyMedia">
              <NuxtImg
                :src="content.craft.image.src"
                :alt="content.craft.image.alt"
              />
            </div>
          </div>
          <div class="col-span-12 lg:col-span-6 space-y-6 order-2 lg:order-2">
            <BaseHeadLine name="h2" size="xl" class="font-normal uppercase">
              {{ content.craft.title }}
            </BaseHeadLine>
            <p
              v-for="(paragraph, index) in content.craft.paragraphs"
              :key="`craft-para-${index}`"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </LayoutContainer>
    </section>

    <section class="brandPage-values">
      <LayoutContainer>
        <BaseHeadLine name="h2" size="lg" class="font-normal uppercase mb-8">
          {{ content.valuesTitle }}
        </BaseHeadLine>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="value in content.values"
            :key="value.title"
            class="brandPage-valueCard"
          >
            <BaseHeadLine size="sm" class="font-medium uppercase">
              {{ value.title }}
            </BaseHeadLine>
            <p>{{ value.description }}</p>
          </article>
        </div>
      </LayoutContainer>
    </section>

    <section class="brandPage-story">
      <LayoutContainer>
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-10 lg:col-start-2 space-y-6">
            <BaseHeadLine
              name="h2"
              size="xl"
              class="font-normal uppercase text-center"
            >
              {{ content.excellence.title }}
            </BaseHeadLine>
            <p
              v-for="(paragraph, index) in content.excellence.paragraphs"
              :key="`excellence-para-${index}`"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </LayoutContainer>
    </section>

    <!-- <section class="brandPage-timeline">
      <LayoutContainer>
        <div class="brandPage-timelineHeader">
          <BaseHeadLine
            name="h2"
            size="lg"
            class="text-white font-normal uppercase"
          >
            Moments clés
          </BaseHeadLine>
          <p>
            Retour sur les chapitres fondateurs qui ont façonné l’univers
            ${shopName.value}.
          </p>
        </div>
        <ul class="brandPage-timelineList">
          <li v-for="event in brandTimeline" :key="event.year">
            <span class="brandPage-timelineYear">{{ event.year }}</span>
            <div>
              <BaseHeadLine size="sm" class="font-medium text-white">
                {{ event.title }}
              </BaseHeadLine>
              <p>{{ event.description }}</p>
            </div>
          </li>
        </ul>
      </LayoutContainer>
    </section> -->

    <!-- <section class="brandPage-gallery">
      <LayoutContainer>
        <BaseHeadLine
          name="h2"
          size="lg"
          class="font-normal uppercase mb-8 text-center"
        >
          Instantanés de l’atelier
        </BaseHeadLine>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtImg
            v-for="(image, index) in inspirationImages"
            :key="index"
            :src="image"
            class="brandPage-galleryImage"
            :alt="`Inspiration ${shopName.value} ${index + 1}`"
          />
        </div>
      </LayoutContainer>
    </section> -->
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const frContent = {
  hero: {
    image: '/images/brand.jpg',
    alt: `Univers de ${shopName.value}`,
    title: `${shopName.value}`,
    subtitle: 'L’élégance parisienne, consciente et intemporelle',
    buttonText: 'Découvrir',
    scrollText: 'Défiler',
  },
  story: {
    title: 'Notre Histoire',
    paragraphs: [
      `${shopName.value} est une marque née à Paris, pensée comme une ode à l'élégance naturelle et à la féminité contemporaine. Elle s'inspire du style parisien dans ce qu'il a de plus authentique : une allure maîtrisée mais jamais figée, une sophistication discrète, une liberté assumée. ${shopName.value} s'adresse aux femmes qui recherchent des pièces justes, durables et bien construites, capables de traverser les saisons sans perdre leur sens ni leur allure.`,
      `Implantée à Paris, ${shopName.value} a fait le choix de placer son bureau au cœur de la capitale afin de rester au plus près des tendances, des marchés et de ses partenaires. Ce bureau parisien est le centre névralgique de la marque. Il concentre le développement commercial, le suivi technique des collections, la relation client ainsi qu'un showroom permanent permettant une immersion directe dans l'univers ${shopName.value}. Cette proximité avec les donneurs d'ordre et les acteurs du secteur garantit une réactivité constante, une vision précise du marché et un suivi des collections en temps réel.`,
    ],
    image: {
      src: '/images/brand-2.jpg',
      alt: 'Vue de l’atelier',
    },
  },
  highlights: [
    {
      title: 'Savoir-faire sur mesure',
      description:
        'Capsules en édition limitée réalisées avec des artisans d’exception pour célébrer un travail raffiné.',
    },
    {
      title: 'Approvisionnement responsable',
      description:
        'Matières tracées auprès d’ateliers conscients, privilégiant la longévité plutôt que l’éphémère.',
    },
    {
      title: 'Aisance parisienne',
      description:
        'Des silhouettes fluides qui accompagnent la journée, du studio aux soirées dans la ville.',
    },
  ],
  craft: {
    title: 'Collections et savoir-faire',
    paragraphs: [
      `La création chez ${shopName.value} repose sur un équilibre exigeant entre intuition stylistique et rigueur technique. Chaque collection est développée avec une attention particulière portée aux coupés, aux matières et aux finitions. Le travail de mécénat, la mise au point technique et le prototypage occupent une place centrale dans le processus créatif, avec une capacité de développement allant jusqu'à soixante échantillons par semaine. Les modèles sont ensuite pensés pour une industrialisation fluide et maîtrisée, afin de garantir une production fidèle à l'intention initiale, sans compromis sur la qualité ou le confort.`,
    ],
    image: {
      src: '/images/brand-3.jpg',
      alt: `Développement technique ${shopName.value}`,
    },
  },
  valuesTitle: 'Nos Valeurs',
  values: [
    {
      title: 'Luxe réfléchi',
      description:
        'Nous créons avec intention, en lançant des éditions ciblées qui favorisent une garde-robe responsable.',
    },
    {
      title: 'Communauté avant tout',
      description:
        'Nos collaborations valorisent des voix diverses — designers, artistes et ateliers à travers l’Europe.',
    },
    {
      title: 'Polyvalence intemporelle',
      description:
        'Des pièces durables conçues pour se combiner à l’infini et traverser les saisons avec élégance.',
    },
  ],
  excellence: {
    title: 'Excellence et vision responsable',
    paragraphs: [
      `Depuis sa création, ${shopName.value} place la qualité et l'exigence au cœur de son projet. Chaque étape de production est pensée et contrôlée avec rigueur par une équipe d'inspecteurs dédiés, afin de garantir que chaque pièce réponde aux normes les plus élevées. Cette attention se traduit par un taux de conformité supérieur à 98 % et par le respect strict des cahiers des charges définis en amont. La sélection des matières, la démarche de négociation des prix, le contrôle des tissus et l'optimisation des coûts font partie intégrante de cette approche globale, qui vise à offrir le meilleur équilibre entre qualité, performance et durabilité.`,
      `Au-delà de la qualité, ${shopName.value} inscrit son développement dans une logique de responsabilité sociale et environnementale forte. La marque s'engage à respecter les normes internationales les plus exigeantes en matière de conditions de travail, de traçabilité des matières et de sécurité de la chaîne d'approvisionnement. Les certifications ICS, SMETA, OCS, RCS et ISO 28000 témoignent de cet engagement concret, tout comme l'usage d'outils reconnus pour mesurer la performance environnementale et sociale.`,
      `L'avenir de ${shopName.value} se construit autour d'investissements continus dans l'innovation et la durabilité. Dès 2026, la marque déploiera de nouvelles certifications liées à la santé, à la sécurité au travail et à la gestion environnementale, tout en mettant en service une centrale solaire qui permettra de réduire significativement son empreinte carbone. Cette vision à long terme reflète une volonté claire : proposer une mode responsable, consciente et tournée vers l'avenir.`,
      `${shopName.value} s'affirme ainsi comme une marque parisienne moderne, où l'élégance rencontre l'exigence et la maîtrise industrielle. Une marque qui crée des pièces désirables, pensées pour durer, et portées par une vision responsable de la mode contemporaine.`,
    ],
  },
  seo: {
    title: `${shopName.value} — Univers de marque`,
    description: `Découvrez l’univers ${shopName.value} : élégance contemporaine, sourcing responsable et silhouettes emblématiques conçues à Paris.`,
  },
} as const;

const enContent = {
  hero: {
    image: '/images/brand.jpg',
    alt: `World of ${shopName.value}`,
    title: `${shopName.value}`,
    subtitle: 'Parisian elegance, conscious and timeless',
    buttonText: 'Discover',
    scrollText: 'Scroll',
  },
  story: {
    title: 'Our Story',
    paragraphs: [
      `${shopName.value} is a brand born in Paris, conceived as an ode to natural elegance and contemporary femininity. It draws on Parisian style at its most authentic: a composed yet fluid attitude, discreet sophistication, and an assured freedom. ${shopName.value} speaks to women who seek considered, durable pieces crafted to move through the seasons without losing their meaning or allure.`,
      `Based in Paris, ${shopName.value} chose to anchor its studio in the heart of the capital to stay close to trends, markets, and partners. This Parisian headquarters is the brand’s nerve center. It concentrates commercial development, technical follow-up of the collections, client relations, and a permanent showroom offering an immediate immersion in the ${shopName.value} universe. This proximity to decision-makers and industry players ensures constant reactivity, a precise vision of the market, and real-time monitoring of the collections.`,
    ],
    image: {
      src: '/images/brand-2.jpg',
      alt: 'View inside the atelier',
    },
  },
  highlights: [
    {
      title: 'Tailored craftsmanship',
      description:
        'Limited-edition capsules created with exceptional artisans to celebrate refined workmanship.',
    },
    {
      title: 'Responsible sourcing',
      description:
        'Materials traced through mindful ateliers, privileging longevity over the ephemeral.',
    },
    {
      title: 'Parisian ease',
      description:
        'Fluid silhouettes that follow the day, from the studio to evenings in the city.',
    },
  ],
  craft: {
    title: 'Collections & craftsmanship',
    paragraphs: [
      `Creation at ${shopName.value} balances instinctive style with technical rigor. Each collection is developed with meticulous attention to cuts, materials, and finishes. Patronage, technical refinements, and prototyping play a central role in the process, with an in-house capacity of up to sixty samples per week. The pieces are then designed for smooth, controlled industrialization to deliver production faithful to the original intent, without compromising on quality or comfort.`,
    ],
    image: {
      src: '/images/brand-3.jpg',
      alt: `${shopName.value} technical development`,
    },
  },
  valuesTitle: 'Our Values',
  values: [
    {
      title: 'Considered luxury',
      description:
        'We create with intention, releasing targeted editions that foster a responsible wardrobe.',
    },
    {
      title: 'Community first',
      description:
        'Our collaborations elevate diverse voices—designers, artists, and ateliers across Europe.',
    },
    {
      title: 'Timeless versatility',
      description:
        'Enduring pieces designed to mix endlessly and move elegantly from season to season.',
    },
  ],
  excellence: {
    title: 'Excellence & responsible vision',
    paragraphs: [
      `Since its inception, ${shopName.value} has placed quality and high standards at the heart of its mission. Every production stage is planned and monitored with rigor by a dedicated team of inspectors to ensure each piece meets the highest requirements. This attention results in a compliance rate above 98% and strict adherence to the specifications defined upstream. Material selection, price negotiations, fabric inspection, and cost optimization are integral to this holistic approach, designed to offer the best balance between quality, performance, and durability.`,
      `Beyond quality, ${shopName.value} anchors its development within a strong social and environmental responsibility framework. The brand is committed to meeting the most demanding international standards for working conditions, material traceability, and supply-chain security. Certifications such as ICS, SMETA, OCS, RCS, and ISO 28000 attest to this concrete commitment, as does the use of recognized tools to measure environmental and social performance.`,
      `${shopName.value}’s future is built on ongoing investments in innovation and sustainability. Starting in 2026, the brand will roll out new certifications focused on health, workplace safety, and environmental management, while commissioning a solar plant that will significantly reduce its carbon footprint. This long-term vision expresses a clear intent: to propose responsible fashion that is conscious and forward-looking.`,
      `${shopName.value} asserts itself as a modern Parisian label where elegance meets high standards and industrial mastery. A brand that crafts desirable, lasting pieces fueled by a responsible vision of contemporary fashion.`,
    ],
  },
  seo: {
    title: `${shopName.value} — Brand universe`,
    description: `Explore the ${shopName.value} universe: contemporary elegance, responsible sourcing, and emblematic silhouettes crafted in Paris.`,
  },
} as const;

const { locale } = useI18n();

const content = computed(() => (locale.value === 'fr' ? frContent : enContent));

function scrollToNextSection() {
  const firstSection = document.querySelector('.brandPage-story');
  if (firstSection) {
    firstSection.scrollIntoView({ behavior: 'smooth' });
  }
}

useHead(() => ({
  title: content.value.seo.title,
  meta: [
    {
      name: 'description',
      content: content.value.seo.description,
    },
  ],
}));
</script>

<style lang="scss">
$brandPage: '.brandPage';

#{$brandPage} {
  @apply -mt-14 text-sm;

  &-hero {
    @apply relative min-h-[calc(100vh-4rem)] overflow-hidden;
  }

  &-heroMedia {
    @apply absolute inset-0 h-full w-full object-cover;
  }

  &-heroOverlay {
    @apply absolute inset-0 bg-black/60 flex items-center;
  }

  &-heroContent {
    @apply relative z-10 max-w-xl py-24 lg:py-32 space-y-5;
  }

  &-heroTitle {
    @apply text-3xl leading-[1] font-semibold uppercase text-white;

    @screen lg {
      @apply text-6xl leading-[0.8];
    }

    i {
      @apply font-[100] not-italic;
    }
  }

  &-heroSubtitle {
    @apply text-base font-light leading-none uppercase text-white;

    @screen lg {
      @apply text-base;
    }
  }

  &-story {
    @apply py-16 lg:py-24 bg-white;
  }

  &-storyMedia {
    @apply overflow-hidden shadow-2xl;
    img {
      @apply w-full h-full object-cover;
    }
  }

  &-highlights {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8;

    article {
      @apply bg-black text-white p-6 space-y-3;
      p {
        @apply text-white/80;
      }
    }
  }

  &-values {
    @apply py-16 lg:py-24 bg-neutral-100;
  }

  &-valueCard {
    @apply bg-white p-6 shadow-md space-y-3 h-full;
    p {
      @apply text-neutral-600;
    }
  }

  &-timeline {
    @apply py-16 lg:py-24 bg-black text-white;

    &Header {
      @apply max-w-2xl space-y-4 mb-10;
      p {
        @apply text-white/70;
      }
    }

    &List {
      @apply relative border-l border-white/20 pl-8 space-y-10;

      li {
        @apply relative;

        &::before {
          content: '';
          @apply absolute -left-3 top-2 w-2 h-2 rounded-full bg-white;
        }

        p {
          @apply text-white/70;
        }
      }
    }

    &Year {
      @apply text-xs font-semibold uppercase tracking-[0.3em] text-white/60;
    }
  }

  &-gallery {
    @apply py-16 lg:py-24 bg-white;
  }

  &-galleryImage {
    @apply w-full h-72 md:h-96 object-cover shadow-lg;
  }
}
</style>

<style lang="scss" scoped>
.brandPage {
  &-scrollIndicator {
    @apply absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center;
    animation: bounce 2s infinite;
  }

  &-scrollArrow {
    @apply w-6 h-6 border-b-2 border-r-2 border-white transform rotate-45 mb-2;
  }

  &-scrollText {
    @apply text-white text-xs uppercase tracking-widest;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%);
  }
  60% {
    transform: translateY(-5px) translateX(-50%);
  }
}
</style>
