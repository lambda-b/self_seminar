<template>
  <figure class="option-chart">
    <svg viewBox="0 0 760 430" role="img" aria-labelledby="option-chart-title option-chart-desc">
      <title id="option-chart-title">Black-Scholesモデルにおけるコールオプション価格</title>
      <desc id="option-chart-desc">
        横軸を原資産価格、縦軸をオプション価格として、時刻T1、T2、T3、満期Tの価格曲線を比較するグラフ。
      </desc>

      <g class="grid">
        <line
          v-for="tick in xTicks"
          :key="`x-grid-${tick}`"
          :x1="xScale(tick)"
          :x2="xScale(tick)"
          :y1="layout.plotTop"
          :y2="layout.plotBottom"
        />
        <line
          v-for="tick in yTicks"
          :key="`y-grid-${tick}`"
          :x1="layout.plotLeft"
          :x2="layout.plotRight"
          :y1="yScale(tick)"
          :y2="yScale(tick)"
        />
      </g>

      <line class="axis" :x1="layout.plotLeft" :x2="layout.plotRight" :y1="layout.plotBottom" :y2="layout.plotBottom" />
      <line class="axis" :x1="layout.plotLeft" :x2="layout.plotLeft" :y1="layout.plotTop" :y2="layout.plotBottom" />

      <g class="ticks">
        <g v-for="tick in xTicks" :key="`x-tick-${tick}`">
          <line :x1="xScale(tick)" :x2="xScale(tick)" :y1="layout.plotBottom" :y2="layout.xTickBottom" />
          <text :x="xScale(tick)" :y="layout.xTickLabelY" text-anchor="middle">{{ tick }}</text>
        </g>
        <g v-for="tick in yTicks" :key="`y-tick-${tick}`">
          <line :x1="layout.yTickLeft" :x2="layout.plotLeft" :y1="yScale(tick)" :y2="yScale(tick)" />
          <text :x="layout.yTickLabelX" :y="yScale(tick)" dy="5" text-anchor="end">{{ tick }}</text>
        </g>
      </g>

      <text class="axis-label" :x="layout.xAxisLabelX" :y="layout.xAxisLabelY" text-anchor="middle">原資産価格 S</text>
      <text class="axis-label vertical" :x="layout.yAxisLabelX" :y="layout.yAxisLabelY" text-anchor="middle">
        オプション価格 V
      </text>

      <line class="strike-line" :x1="xScale(strike)" :x2="xScale(strike)" :y1="layout.plotTop" :y2="layout.plotBottom" />
      <text class="strike-label" :x="layout.strikeLabelX" :y="layout.strikeLabelY">K</text>

      <path
        v-for="series in seriesPaths"
        :key="series.label"
        class="price-line"
        :d="series.path"
        :style="series.style"
      />

      <g class="legend" :transform="layout.legendTransform">
        <line class="legend-line" x1="0" x2="24" y1="0" y2="0" style="stroke: #176b87" />
        <text x="36" y="5">T1</text>
        <line class="legend-line" x1="0" x2="24" y1="24" y2="24" style="stroke: #8a5a9e" />
        <text x="36" y="29">T2</text>
        <line class="legend-line" x1="0" x2="24" y1="48" y2="48" style="stroke: #d07c2d" />
        <text x="36" y="53">T3</text>
        <line class="legend-line" x1="0" x2="24" y1="72" y2="72" style="stroke: #12343b" />
        <text x="36" y="77">T(満期)</text>
      </g>

      <text class="time-order" :x="layout.plotRight" :y="layout.timeOrderY" text-anchor="end">
        T1 &lt; T2 &lt; T3 &lt; T(満期)
      </text>
    </svg>
  </figure>
</template>

<script setup lang="ts">
const layout = {
  plotLeft: 72,
  plotRight: 704,
  plotTop: 28,
  plotBottom: 356,
  xTickBottom: 362,
  xTickLabelY: 382,
  yTickLeft: 66,
  yTickLabelX: 60,
  xAxisLabelX: 388,
  xAxisLabelY: 414,
  yAxisLabelX: 18,
  yAxisLabelY: 192,
  strikeLabelX: 396,
  strikeLabelY: 46,
  legendTransform: "translate(588, 252)",
  timeOrderY: 404,
} as const;
const minS = 75;
const maxS = 125;
const maxPrice = 30;
const strike = 100;
const rate = 0.02;
const volatility = 0.25;

// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const xTicks = [75, 90, 100, 110, 125];
// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const yTicks = [0, 10, 20, 30];

const curves = [
  { label: "T1", tau: 0.8, color: "#176b87" },
  { label: "T2", tau: 0.45, color: "#8a5a9e" },
  { label: "T3", tau: 0.18, color: "#d07c2d" },
  { label: "T(満期)", tau: 0, color: "#12343b" },
];

const xScale = (s: number) =>
  layout.plotLeft + ((s - minS) / (maxS - minS)) * (layout.plotRight - layout.plotLeft);
const yScale = (price: number) =>
  layout.plotBottom - (price / maxPrice) * (layout.plotBottom - layout.plotTop);

const normalCdf = (x: number) => {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * absX);
  const erf =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-absX * absX);

  return 0.5 * (1 + sign * erf);
};

const callPrice = (s: number, tau: number) => {
  if (tau <= 0) {
    return Math.max(s - strike, 0);
  }

  const sqrtTau = Math.sqrt(tau);
  const variance = volatility * volatility;
  const d1 = (Math.log(s / strike) + (rate + variance / 2) * tau) / (volatility * sqrtTau);
  const d2 = d1 - volatility * sqrtTau;

  return s * normalCdf(d1) - strike * Math.exp(-rate * tau) * normalCdf(d2);
};

// biome-ignore lint/correctness/noUnusedVariables: referenced by the Vue template
const seriesPaths = curves.map((curve) => {
  const points = Array.from({ length: 96 }, (_, index) => {
    const s = minS + ((maxS - minS) * index) / 95;
    return `${index === 0 ? "M" : "L"} ${xScale(s).toFixed(1)} ${yScale(callPrice(s, curve.tau)).toFixed(1)}`;
  });

  return {
    ...curve,
    path: points.join(" "),
    style: `stroke: ${curve.color}`,
  };
});
</script>

<style scoped>
.option-chart {
  margin: 0.4rem 0 0;
}

svg {
  display: block;
  width: 100%;
  max-height: 27rem;
}

.grid line {
  stroke: #d8e7e5;
  stroke-width: 1;
}

.axis,
.ticks line {
  stroke: #526465;
  stroke-width: 1.4;
}

.ticks text,
.legend text,
.axis-label,
.strike-label,
.time-order {
  fill: #12343b;
  font-size: 15px;
}

.axis-label {
  font-weight: 700;
}

.vertical {
  transform: rotate(-90deg);
  transform-origin: 18px 192px;
}

.strike-line {
  stroke: #8ca3a0;
  stroke-dasharray: 5 5;
  stroke-width: 1.2;
}

.strike-label {
  font-weight: 700;
}

.time-order {
  font-weight: 700;
}

.price-line {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3.5;
}

.legend-line {
  stroke-linecap: round;
  stroke-width: 2.2;
}
</style>
