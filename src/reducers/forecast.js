const INITIAL_STATE = {
  city: '',
  forecast: [],
  loading: false,
  error: null,
  lastRequestTime: null,
};

const forecast = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOAD_FORECAST':
      return {
        ...state,
        loading: true,
      };
    case 'LOAD_FORECAST_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        forecast: action.forecast,
        lastRequestTime: new Date(),
        city: action.city,
      };
    case 'LOAD_FORECAST_FAIL':
      return {
        ...state,
        loading: false,
        error: action.error,
        lastRequestTime: null,
      };
    default:
      return state;
  }
};

export default forecast;
