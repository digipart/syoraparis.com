<template>
  <div class="pageFactoryClearance">
    <div>
      <div class="grid grid-cols-12">
        <div class="col-span-12 lg:col-span-6 px-5 py-5">
          <LayoutCms>
          <div v-html="content"></div>  
          </LayoutCms>
        </div>
        <div class="col-span-12 lg:col-span-6 ">
          <img
            src="/images/nafnaf.jpg"
            alt=""
            class="h-screen w-full object-cover lg:sticky top-[4.5rem]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const fr = `
 <h1>Vente Exceptionnelle Ouverte au Public</h1>

            <p>
              Vente organisée au sein d’un <strong>dépôt privé</strong>, non
              assimilable à un ERP, exceptionnellement ouvert au public pour une
              durée limitée.
            </p>

            <h2>VENTE PRIVÉE – DÉSTOCKAGE</h2>

            <p>
              Découvrez une vaste sélection de
              <strong>vêtements de prêt-à-porter féminin</strong> à prix
              réduits.
            </p>

            <h3>Plus de 200 références disponibles</h3>

            <p>
              Manteaux, Vestes, Fourrures, Pantalons, Jupes, Robes, Chemises,
              T-shirts, Tops, Shorts, Combinaisons, Trenchs…
            </p>

            <ul class="cats">
              <li>Manteaux</li>
              <li>Vestes</li>
              <li>Fourrures</li>
              <li>Pantalons</li>
              <li>Jupes</li>
              <li>Robes</li>
              <li>Chemises</li>
              <li>T-shirts</li>
              <li>Tops</li>
              <li>Shorts</li>
              <li>Combinaisons</li>
              <li>Trenchs</li>
            </ul>

            <h2>Jusqu’à -70%</h2>

            <p>
              Bénéficiez de <strong>remises exceptionnelles</strong> sur une
              large sélection d’articles pendant toute la durée de la vente.
            </p>

            <h3>Dates et horaires</h3>

            <p>
              Du <strong>5 décembre 2025</strong> au <strong>4 mars 2026</strong
              ><br />
              Du <strong>mardi au dimanche</strong> de
              <strong>10h à 19h</strong>
            </p>

            <h3>Adresse</h3>
            <p>
              55 Chemin Latéral<br />
              93140 BONDY
            </p>

            <h3>Contact</h3>
            <p>info@syoraparis.fr</p>

            <p>
              <em
                >Stocks limités – Offre valable jusqu’à épuisement des articles
                disponibles.</em
              >
            </p>
`;

const en = `
 <h1>Exceptional Sale Open to the Public</h1>

            <p>
              Sale organized within a <strong>private warehouse</strong>, not
              classifiable as a public-access building, exceptionally open to the public for a
              limited time.
            </p>

            <h2>PRIVATE SALE – CLEARANCE</h2>

            <p>
              Discover a wide selection of
              <strong>women's ready-to-wear clothing</strong> at reduced
              prices.
            </p>

            <h3>More than 200 items available</h3>

            <p>
              Coats, Jackets, Furs, Trousers, Skirts, Dresses, Shirts,
              T-shirts, Tops, Shorts, Jumpsuits, Trench coats…
            </p>

            <ul class="cats">
              <li>Coats</li>
              <li>Jackets</li>
              <li>Furs</li>
              <li>Trousers</li>
              <li>Skirts</li>
              <li>Dresses</li>
              <li>Shirts</li>
              <li>T-shirts</li>
              <li>Tops</li>
              <li>Shorts</li>
              <li>Jumpsuits</li>
              <li>Trench coats</li>
            </ul>

            <h2>Up to 70% off</h2>

            <p>
              Benefit from <strong>exceptional discounts</strong> on a
              wide selection of items throughout the sale.
            </p>

            <h3>Dates and opening hours</h3>

            <p>
              From <strong>December 5, 2025</strong> to <strong>March 4, 2026</strong
              ><br />
              From <strong>Tuesday to Sunday</strong> from
              <strong>10am to 7pm</strong>
            </p>

            <h3>Address</h3>
            <p>
              55 Chemin Latéral<br />
              93140 BONDY
            </p>

            <h3>Contact</h3>
            <p>info@syoraparis.fr</p>

            <p>
              <em
                >Limited stock – Offer valid while supplies last.</em
              >
            </p>
`;

const content = computed(() => {
  return locale.value === 'fr' ? fr : en;
});
</script>

<style lang="scss">
.pageFactoryClearance ul {
  @apply flex gap-2 flex-wrap list-none ml-0;

  li {
    @apply border py-1 px-2 mb-0 text-xs;
  }
}
</style>
