// TODO: Need to change the address
const address = "http://127.0.0.1:56000/";

export async function restCheck() {
  const res = await fetch(address);
  const data = await res.json();

  return data;
}

export async function setCity(city) {
  const res = await fetch(`${address}forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: city }),
  });

  const data = await res.json();

  return data.status === "OK" && data.status_code === 200;
}

export async function getForecast() {
  const res = await fetch(`${address}forecast`);
  const data = await res.json();

  return data;
}

export async function newAlarm(payload) {
  console.log(
    `Payload to send ${address}alarms/new:\n${JSON.stringify(payload)} `
  );

  const res = await fetch(`${address}alarms/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log(data);
  return data;
}

export async function listAlarms() {
  const res = await fetch(`${address}alarms/list`);
  const data = await res.json();
  return data;
}

export async function startAllAlarms() {
  const res = await fetch(`${address}alarms/start_all`);
  const data = await res.json();
  return data;
}

export async function startAlarm(title) {
  const res = await fetch(`${address}alarms/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  const data = await res.json();
  return data;
}

export async function clearAlarm(title) {
  const res = await fetch(`${address}alarms/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title }),
  });

  const data = await res.json();
  return data;
}
export async function clearAllAlarms() {
  const res = await fetch(`${address}alarms/clear_all`);
  const data = await res.json();
  return data;
}

export async function setAutoSave(t) {
  const res = await fetch(`${address}alarms/set_auto_save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t: t }),
  });
  const data = await res.json();
  return data;
}

export async function setAutoStart(t) {
  const res = await fetch(`${address}alarms/set_auto_start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ t: t }),
  });
  const data = await res.json();
  return data;
}
