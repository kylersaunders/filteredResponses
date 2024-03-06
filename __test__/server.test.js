// const request = require('supertest');
// const axios = require('axios');
// const app = require('../src/server');
// const { formResponses } = require('./mocks/responses');

import request from 'supertest';
import axios from 'axios';
import app from '../src/server';
import { formResponses } from './mocks/responses';

// Mock axios globally
jest.mock('axios');

describe('/:formId/filteredResponses endpoint', () => {
  it('should handle the API response correctly', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        responses: formResponses,
        totalResponses: 0,
        pageCount: 0,
      },
    });

    const response = await request(app).get('/12345/filteredResponses');
    expect(response.status).toBe(200);
    // Add more assertions here based on your mock data and expected output
  });

  // Add more tests here as needed
});
