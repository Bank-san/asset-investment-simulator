<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  mdiCurrencyJpy,
  mdiCalendarClock,
  mdiPercent,
  mdiChartLine,
  mdiCash,
  mdiTrendingUp,
} from '@mdi/js';

const investmentPeriod = ref(10);
const monthlyInvestment = ref(30000);
const annualInterestRate = ref(5);

const yearlyBreakdown = computed(() => {
  const monthlyRate = annualInterestRate.value / 100 / 12;
  const results: { year: number; principal: number; value: number }[] = [];

  let currentValue = 0;
  for (let year = 1; year <= investmentPeriod.value; year++) {
    for (let month = 0; month < 12; month++) {
      currentValue += monthlyInvestment.value;
      currentValue *= 1 + monthlyRate;
    }
    results.push({
      year,
      principal: monthlyInvestment.value * 12 * year,
      value: Math.round(currentValue),
    });
  }
  return results;
});

const totalPrincipal = computed(
  () => monthlyInvestment.value * investmentPeriod.value * 12
);

const futureValue = computed(() => {
  const last = yearlyBreakdown.value[yearlyBreakdown.value.length - 1];
  return last ? last.value : 0;
});

const gain = computed(() => futureValue.value - totalPrincipal.value);

const gainRate = computed(() => {
  if (totalPrincipal.value === 0) return 0;
  return ((gain.value / totalPrincipal.value) * 100).toFixed(1);
});

const maxChartValue = computed(() => {
  const last = yearlyBreakdown.value[yearlyBreakdown.value.length - 1];
  return last ? last.value : 1;
});

function principalBarWidth(principal: number) {
  return (principal / maxChartValue.value) * 100;
}

function gainBarWidth(value: number, principal: number) {
  return ((value - principal) / maxChartValue.value) * 100;
}

function formatCurrency(value: number): string {
  if (value >= 100_000_000) {
    return (value / 100_000_000).toFixed(2) + '億';
  }
  if (value >= 10_000) {
    return (value / 10_000).toFixed(0) + '万';
  }
  return value.toLocaleString();
}
</script>

<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-4 pa-md-8" style="max-width: 960px">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-h4 text-md-h3 font-weight-bold text-primary">
            <v-icon :icon="mdiChartLine" size="36" class="mr-2" />
            資産運用シミュレーター
          </h1>
          <p class="text-body-2 text-medium-emphasis mt-2">
            毎月の積立投資でどれだけ資産が増えるかシミュレーションできます
          </p>
        </div>

        <!-- Input Section -->
        <v-card class="mb-6" rounded="lg" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold bg-primary text-white pa-4">
            投資条件を設定
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="monthlyInvestment"
                  :prepend-inner-icon="mdiCurrencyJpy"
                  label="毎月の投資金額"
                  suffix="円"
                  type="number"
                  :min="0"
                  :step="10000"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
                <v-slider
                  v-model="monthlyInvestment"
                  :min="0"
                  :max="200000"
                  :step="10000"
                  color="primary"
                  class="mt-2"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="investmentPeriod"
                  :prepend-inner-icon="mdiCalendarClock"
                  label="投資期間"
                  suffix="年"
                  type="number"
                  :min="1"
                  :max="50"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
                <v-slider
                  v-model="investmentPeriod"
                  :min="1"
                  :max="50"
                  :step="1"
                  color="primary"
                  class="mt-2"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="annualInterestRate"
                  :prepend-inner-icon="mdiPercent"
                  label="想定年利率"
                  suffix="%"
                  type="number"
                  :min="0"
                  :max="20"
                  :step="0.1"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
                <v-slider
                  v-model="annualInterestRate"
                  :min="0"
                  :max="20"
                  :step="0.1"
                  color="primary"
                  class="mt-2"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Results Summary -->
        <v-row class="mb-6">
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="text-center pa-4">
              <v-icon :icon="mdiCash" size="32" color="grey" class="mb-2" />
              <div class="text-caption text-medium-emphasis">元本（積立総額）</div>
              <div class="text-h5 font-weight-bold mt-1">
                {{ totalPrincipal.toLocaleString() }}
                <span class="text-body-2">円</span>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="text-center pa-4 result-card-main">
              <v-icon :icon="mdiChartLine" size="32" color="primary" class="mb-2" />
              <div class="text-caption text-medium-emphasis">将来の資産額</div>
              <div class="text-h5 font-weight-bold text-primary mt-1">
                {{ futureValue.toLocaleString() }}
                <span class="text-body-2">円</span>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card rounded="lg" elevation="2" class="text-center pa-4">
              <v-icon :icon="mdiTrendingUp" size="32" color="secondary" class="mb-2" />
              <div class="text-caption text-medium-emphasis">運用益</div>
              <div class="text-h5 font-weight-bold text-secondary mt-1">
                +{{ gain.toLocaleString() }}
                <span class="text-body-2">円</span>
              </div>
              <div class="text-caption text-medium-emphasis">
                (+{{ gainRate }}%)
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Year-by-Year Chart -->
        <v-card rounded="lg" elevation="2">
          <v-card-title class="text-subtitle-1 font-weight-bold bg-primary text-white pa-4">
            年別 資産推移
          </v-card-title>
          <v-card-text class="pa-4 pa-md-6">
            <div class="chart-container">
              <div
                v-for="item in yearlyBreakdown"
                :key="item.year"
                class="chart-row"
              >
                <div class="chart-label">{{ item.year }}年</div>
                <div class="chart-bars">
                  <div
                    class="bar bar-principal"
                    :style="{ width: principalBarWidth(item.principal) + '%' }"
                  />
                  <div
                    class="bar bar-gain"
                    :style="{
                      width: gainBarWidth(item.value, item.principal) + '%',
                    }"
                  />
                </div>
                <div class="chart-value">{{ formatCurrency(item.value) }}円</div>
              </div>
            </div>
            <div class="d-flex align-center mt-4 ga-4 justify-center">
              <div class="d-flex align-center">
                <div class="legend-box bg-primary mr-2" />
                <span class="text-caption">元本</span>
              </div>
              <div class="d-flex align-center">
                <div class="legend-box bg-secondary mr-2" />
                <span class="text-caption">運用益</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.result-card-main {
  border: 2px solid rgb(var(--v-theme-primary));
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 28px;
}

.chart-label {
  flex: 0 0 40px;
  font-size: 0.75rem;
  text-align: right;
  color: rgba(0, 0, 0, 0.6);
}

.chart-bars {
  flex: 1;
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
}

.bar {
  height: 100%;
  transition: width 0.4s ease;
}

.bar-principal {
  background: rgb(var(--v-theme-primary));
}

.bar-gain {
  background: rgb(var(--v-theme-secondary));
}

.chart-value {
  flex: 0 0 72px;
  font-size: 0.75rem;
  text-align: right;
  font-weight: 600;
}

.legend-box {
  width: 16px;
  height: 12px;
  border-radius: 2px;
}
</style>
