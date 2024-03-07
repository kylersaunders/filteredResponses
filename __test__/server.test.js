const request = require('supertest');
const axios = require('axios');
const server = require('../src/server');
const { formResponses } = require('../src/data/responses');

// Mock axios globally
jest.mock('axios');

axios.get = jest.fn().mockResolvedValue({
  data: {
    responses: formResponses,
    totalResponses: 0,
    pageCount: 0,
  },
});

// superficial tests to confirm that the server is running
describe('/:formId/filteredResponses endpoint', () => {
  it('should handle the API response correctly', async () => {
    const response = await request(server).get('/12345/filteredResponses');
    expect(response.status).toBe(200);
  });
  it('should handle out of bounds params correctly', async () => {
    const response = await request(server).get('/12345/filteredResponses?limit=151');
    expect(response.status).toBe(400);
  });
  it('should handle null params correctly', async () => {
    const response = await request(server).get('/12345/filteredResponses?limit=');
    expect(response.status).toBe(200);
  });
  it('should handle unreal dates correctly', async () => {
    const response = await request(server).get('/12345/filteredResponses?beforeDate=2023-13-06T00:00:00.000Z');
    expect(response.status).toBe(200);
  });
  it('should handle bad format dates correctly', async () => {
    const response = await request(server).get('/12345/filteredResponses?beforeDate=2023-131-06T00:00:00.000Z');
    expect(response.status).toBe(400);
  });
  // only w/o mock
  // it('should return a data.responses list of length 5 when the ?limit=5 query is passed', async () => {
  //   const response = await request(server).get('/12345/filteredResponses?limit=5');
  //   expect(response.body.responses.length).toBe(5);
  // });
});

afterAll(() => {
  server.close();
});
