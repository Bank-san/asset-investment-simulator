<script setup lang="ts">
import { ref, watch } from 'vue';

const investmentPeriod = ref(10);
const monthlyInvestment = ref(10000);
const annualInterestRate = ref(5);
const assetValue = ref(calculateAssetValue());

function calculateAssetValue() {
  const totalMonths = investmentPeriod.value * 12;
  const monthlyInterestRate = annualInterestRate.value / 100 / 12;

  let currentValue = 0;
  for (let i = 0; i < totalMonths; i++) {
    currentValue += monthlyInvestment.value;
    currentValue *= 1 + monthlyInterestRate;
  }

  return currentValue;
}

function updateAssetValue() {
  assetValue.value = calculateAssetValue();
}

watch(
  [investmentPeriod, monthlyInvestment, annualInterestRate],
  updateAssetValue
);
</script>

<template>
  <v-app>
    <div class="asset-simulator">
      <h2>資産運用シミュレーター</h2>
      <v-card>
        <div class="input-group">
          <label>投資期間（年）:</label>
          <input v-model="investmentPeriod" type="number" min="1" />
        </div>
        <div class="input-group">
          <label>毎月の投資金額（円）:</label>
          <input
            v-model="monthlyInvestment"
            type="number"
            min="0"
            step="10000"
          />
        </div>
        <div class="input-group">
          <label>年利率（%）:</label>
          <input v-model="annualInterestRate" type="number" min="0" />
        </div>
      </v-card>
      <div class="export" v-if="assetValue !== null">
        <p>
          元本:
          {{
            Math.round(
              monthlyInvestment * investmentPeriod * 12
            ).toLocaleString()
          }}
          円
        </p>
        <p>将来の資産価値: {{ Math.round(assetValue).toLocaleString() }} 円</p>
        <p>
          増加額: +{{
            Math.round(
              assetValue - monthlyInvestment * investmentPeriod * 12
            ).toLocaleString()
          }}
          円
        </p>
      </div>
      <v-btn class="calculate-button" @click="calculateAssetValue">
        計算する
      </v-btn>
    </div>
  </v-app>
</template>

<style scoped>
.asset-simulator {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  flex: 0 0 150px;
  font-weight: bold;
}

.input-group input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.export {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.calculate-button {
  display: block;
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.calculate-button:hover {
  background-color: #45a049;
}

p {
  margin: 10px 0;
}
</style>
