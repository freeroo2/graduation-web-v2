import * as echarts from "echarts/core";

import { PieChart, BarChart, LineChart, MapChart } from "echarts/charts";
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";

import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  GeoComponent
} from "echarts/components";

const { use, registerTheme } = echarts;

use([
  PieChart,
  BarChart,
  LineChart,
  SVGRenderer,
  GridComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer
]);

// 自定义主题
import theme from "./theme.json";
registerTheme("ovilia-green", theme);

export default echarts;
