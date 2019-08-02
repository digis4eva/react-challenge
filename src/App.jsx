import React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import Form from './components/Form';
import Graph from './components/Graph';

am4core.useTheme(am4themes_animated);

const App = () => (
  <div>
    <Form />
    <Graph />
  </div>
);

export default App;
