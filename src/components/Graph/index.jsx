import React from 'react';
import { connect } from 'react-redux';
import { addDays, setHours } from 'date-fns';
import classNames from 'classnames';

import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import imgSrc from '../../graphic/spinning_logo_2.gif';
import './Graph.css';

class Graph extends React.Component {
  static getColor(entry) {
    if (entry.temp > 30) return 'red';
    if (entry.temp <= 30 && entry.temp >= 26) return 'yellow';
    if (entry.temp < 26 && entry.temp >= 20) return 'green';
    return 'blue';
  }

  constructor(props) {
    super(props);

    this.chart = null;
    this.lineSeries = null;
  }

  componentDidMount() {
    this.chart = am4core.create('graph-div', am4charts.XYChart);

    this.chart.cursor = new am4charts.XYCursor();

    const dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.renderer.labels.template.adapter.add('text', text => `${text}°C`);

    dateAxis.renderer.minGridDistance = 45;

    const yesterday = addDays(new Date(), -1);

    for (let i = 0; i < 7; i++) {
      const currentDay = addDays(yesterday, i);
      const morning = setHours(currentDay, 6);
      const evening = setHours(currentDay, 20);
      const dayRange = dateAxis.axisRanges.create();
      dayRange.date = morning;
      dayRange.endDate = evening;
      dayRange.axisFill.fill = am4core.color('#c1faff');
      dayRange.axisFill.fillOpacity = 1;
      dayRange.axisFill.fillModifier = new am4core.LinearGradientModifier();
      dayRange.axisFill.fillModifier.opacities = [0.5, 0.6, 0.6, 0.5];
      dayRange.axisFill.fillModifier.offsets = [0, 0.1, 0.9, 1];

      const nightRange = dateAxis.axisRanges.create();
      nightRange.date = evening;
      nightRange.endDate = addDays(morning, 1);
      nightRange.axisFill.fill = am4core.color('#3319b4');
      nightRange.axisFill.fillOpacity = 1;
      nightRange.axisFill.fillModifier = new am4core.LinearGradientModifier();
      nightRange.axisFill.fillModifier.opacities = [0.9, 1, 1, 0.9];
      nightRange.axisFill.fillModifier.offsets = [0, 0.1, 0.9, 1];
    }

    this.lineSeries = this.chart.series.push(new am4charts.LineSeries());
    this.lineSeries.dataFields.valueY = 'temp';
    this.lineSeries.dataFields.dateX = 'dt';
    this.lineSeries.name = 'Temperature';
    this.lineSeries.strokeWidth = 2;
    this.lineSeries.stroke = this.gradient;
    this.lineSeries.tensionX = 0.9;
    this.lineSeries.tooltipHTML = '<div style="color: black">Wind speed: {wind.speed}m/s</div>';

    this.lineSeries.tooltip.getFillFromObject = false;
    this.lineSeries.tooltip.background.fill = am4core.color('#FFF');

    this.lineSeries.tooltip.getStrokeFromObject = false;
    this.lineSeries.tooltip.background.stroke = am4core.color('lightgrey');
    this.lineSeries.tooltip.background.strokeWidth = 2;

    const bullet = this.lineSeries.bullets.push(new am4charts.Bullet());
    const image = bullet.createChild(am4core.Image);
    image.propertyFields.href = 'icon';
    image.width = 40;
    image.height = 40;
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
  }

  componentDidUpdate(oldProps) {
    if (oldProps.forecast !== this.props.forecast) {
      setTimeout(() => {
        this.lineSeries.stroke = this.recalculateGradient(this.props.forecast);
        this.chart.data = this.props.forecast;
      }, 300);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  recalculateGradient(forecast) {
    const newGradient = new am4core.LinearGradient();

    forecast.forEach(e => newGradient.addColor(Graph.getColor(e)));

    return newGradient;
  }

  render() {
    const graphClass = classNames({
      graph: true,
      'd-block': !!this.props.city,
    });

    return (
      <div className="graph-container">
        <div id="graph-div" className={graphClass} />
        {
          this.loading &&
          <div className="spinner-container">
            <img height="300" width="400" src={imgSrc} />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return ({
    loading: state.forecast.loading,
    forecast: state.forecast.forecast,
    city: state.forecast.city,
  });
}

export default connect(mapStateToProps)(Graph);
