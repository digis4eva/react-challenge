import axios from 'axios';
import { differenceInMinutes } from 'date-fns';

export const displayName = name => ({
  type: 'DISPLAY_NAME',
  name,
});

const apiKey = process.env.API_KEY;

export const loadForecast = city => (dispatch, getState) => {
  const { forecast: { lastRequestTime, city: prevCity } } = getState();

  if (
    lastRequestTime
    && Math.abs(differenceInMinutes(lastRequestTime, new Date())) < 10
    && prevCity.toLocaleLowerCase() === city.toLocaleLowerCase()
  ) {
    return Promise.resolve();
  }

  dispatch({ type: 'LOAD_FORECAST' });

  return axios
    .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`)
    .then((response) => {
      dispatch({
        type: 'LOAD_FORECAST_SUCCESS',
        forecast: response.data.list.map(e => Object.assign(e, {
          dt: new Date(e.dt * 1000),
          temp: e.main.temp - 274,
          icon: `https://openweathermap.org/img/wn/${e.weather[0].icon}.png`,
        })),
        city,
      });
    })
    .catch(error => dispatch({ type: 'LOAD_FORECAST_FAIL', error }));
};
