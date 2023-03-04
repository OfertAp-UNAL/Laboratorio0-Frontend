import http from "./httpService";
import config from "../config.json";
const apiUrl = config.apiUrl;

const apiEndpoint = apiUrl + "/viviendas/";

function houseUrl(id) {
  return `${apiEndpoint}${id}/`;
}

export function getHouses() {
  return http.get(apiEndpoint);
}

export function getHouse(houseId) {
  return http.get(houseUrl(houseId));
}

export function createHouse(house) {
  return http.post(apiEndpoint, house);
}

export function updateHouse(id, house) {
  return http.patch(houseUrl(id), house);
}

export function deleteHouse(houseId) {
  return http.delete(houseUrl(houseId));
}
