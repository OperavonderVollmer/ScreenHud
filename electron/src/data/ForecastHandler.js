const fetchForecasts = async () => {
  const res = await window.controlAPI.getForecast();
  return res;
};

export async function forecast_scheduler() {
  const res = await fetchForecasts();

  if (!res || res.status !== "OK" || res.status_code !== 200) {
    console.log("Failed to fetch forecast");
    return;
  }

  const forecasts = res.payload;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const hour0 = parseInt(forecasts[0]?.timeGB?.split(":")[0], 10);
  const hour1 = parseInt(forecasts[1]?.timeGB?.split(":")[0], 10);

  const forecastMinutes0 = hour0 * 60;
  const forecastMinutes1 = hour1 * 60;

  // Find the first forecast that is after current time
  const nextForecastMinutes =
    forecastMinutes0 > currentMinutes
      ? forecastMinutes0
      : forecastMinutes1 > currentMinutes
      ? forecastMinutes1
      : forecastMinutes0 + 24 * 60; // wrap to next day

  let deltaMinutes = nextForecastMinutes - currentMinutes;
  const msDelta = deltaMinutes * 60 * 1000;

  return { forecasts, msDelta };
}
