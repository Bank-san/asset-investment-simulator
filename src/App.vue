<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AssetSimulator',
  setup() {
    const investmentPeriod = ref(10);
    const monthlyInvestment = ref(10000);
    const annualInterestRate = ref(5);
    const assetValue = ref<number | null>(null);
    
    const calculateAssetValue = () => {
      const totalMonths = investmentPeriod.value * 12;
      const monthlyInterestRate = annualInterestRate.value / 100 / 12;
      
      let currentValue = 0;
      for (let i = 0; i < totalMonths; i++) {
        currentValue += monthlyInvestment.value;
        currentValue *= 1 + monthlyInterestRate;
      }
      
      assetValue.value = currentValue;
    };
    
    return {
      investmentPeriod,
      monthlyInvestment,
      annualInterestRate,
      assetValue,
      calculateAssetValue,
    };
  },
});
</script>

<template>
  <div>
    <h2>資産運用シミュレーター</h2>
    <div>
      <label>投資期間（年）:</label>
      <input v-model="investmentPeriod" type="number" min="1" />
    </div>
    <div>
      <label>毎月の投資金額（円）:</label>
      <input v-model="monthlyInvestment" type="number" min="0" />
    </div>
    <div>
      <label>年利率（%）:</label>
      <input v-model="annualInterestRate" type="number" min="0" />
    </div>
    <div>
      <button @click="calculateAssetValue">計算する</button>
    </div>
    <div v-if="assetValue !== null">
      <p>将来の資産価値: {{ Math.round(assetValue).toLocaleString() }} 円</p>
    </div>
  </div>
</template>