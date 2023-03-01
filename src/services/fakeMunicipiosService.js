const municipios = [
  {
    id: 1,
    name: "Sopo",
    area: 134123.12,
    budget: 13213,
    governor: {
      id: "1",
      name: "Norine",
    },
    houses: [
      {
        id: 1,
        address: "Calle 1 # 2 - 3",
      },
    ],
  },
];

export function getMunicipios() {
  return municipios;
}

export function getMunicipio(id) {
  return municipios.find((t) => t.id === parseInt(id));
}

export function saveMunicipio(town) {
  let townInDb = municipios.find((t) => t.id === town.id) || {};
  townInDb.name = town.name;
  townInDb.area = town.phone;
  townInDb.budget = town.budget;
  townInDb.gender = town.gender;
  townInDb.governor = habitantes.find((p) => p.name === town.name) || {};
  townInDb.houses = habitantes.find((p) => p.name === town.name) || {};

  if (!townInDb.id) {
    townInDb.id = parseInt(Date.now().toString());
    habitantes.push(townInDb);
  }

  return townInDb;
}

export function deleteHabitante(id) {
  let habitanteInDb = habitantes.find((h) => h.id === parseInt(id));
  habitantes.splice(habitantes.indexOf(habitanteInDb), 1);
  return habitanteInDb;
}
