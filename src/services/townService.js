import http from "./httpService";
import config from "../config.json";
const apiUrl = config.apiUrl;

const apiEndpoint = apiUrl + "/municipios/";

function townUrl(id) {
  return `${apiEndpoint}${id}/`;
}

export function getTowns() {
  return http.get(apiEndpoint);
}

export function getTown(townId) {
  return http.get(townUrl(townId));
}

export function createTown(town) {
  return http.post(apiEndpoint, town);
}

export function updateTown(town) {
  return http.put(townUrl(town.id), town);
}

export function deleteTown(townId) {
  return http.delete(townUrl(townId));
}
