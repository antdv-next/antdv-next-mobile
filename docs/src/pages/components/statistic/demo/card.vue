<docs lang="zh-CN">
移动端常见的资产 / 数据概览卡片。
</docs>

<template>
  <div class="overview">
    <am-statistic
      title="总资产 (元)"
      :value="268547.36"
      :precision="2"
      class="overview-total"
    />
    <div class="overview-grid">
      <am-statistic title="昨日收益" :value="128.5" :precision="2" prefix="+" />
      <am-statistic title="累计收益" :value="12893.4" :precision="2" />
      <am-statistic title="持仓" :value="6" suffix="只" />
    </div>
  </div>
</template>

<style scoped>
.overview {
  padding: 20px 16px;
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  border-radius: 12px;
}

.overview .am-statistic {
  --am-statistic-title-color: rgb(255 255 255 / 75%);
  --am-statistic-content-color: #fff;
}

.overview-total {
  --am-statistic-content-font-size: 32px;
  --am-statistic-content-font-weight: 600;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.overview-grid .am-statistic {
  --am-statistic-content-font-size: 18px;
  --am-statistic-title-font-size: 12px;
}
</style>
