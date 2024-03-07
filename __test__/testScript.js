const filters = [
  {
    id: 'bE2Bo4cGUv49cjnqZ4UnkW',
    condition: 'equals',
    value: 'Test',
  },
];

const requestParams = {
  filters: JSON.stringify(filters),
  offset: 0,
  limit: 150,
  sort: 'asc',
};

async function fetchFilteredResponses(params) {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`http://localhost:3000/cLZojxk94ous/filteredResponses?${queryParams}`);
  console.log(await response.json());
}

fetchFilteredResponses(requestParams);
