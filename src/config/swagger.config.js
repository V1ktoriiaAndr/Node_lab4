const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loans API',
      version: '1.0.0',
      description: 'Operations with loans',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    paths: {
      '/api/loans': {
        get: {
          tags: ['Loans'],
          summary: 'Get all loans',
          responses: {
            '200': { description: 'Success' },
          },
        },
        post: {
          tags: ['Loans'],
          summary: 'Create a new loan',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['client_id', 'loan_type_id', 'loan_amount', 'scheduled_return_date'],
                  properties: {
                    client_id: { type: 'string', example: '652a1b2c1234567890abcdef' },
                    loan_type_id: { type: 'string', example: '652a1b3d1234567890fedcba' },
                    loan_amount: { type: 'number', example: 15000 },
                    scheduled_return_date: { type: 'string', format: 'date-time', example: '2026-12-31T23:59:59.000Z' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Created' },
          },
        },
      },
      '/api/loans/{id}': {
        delete: {
          tags: ['Loans'],
          summary: 'Delete a loan',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Deleted' },
          },
        },
        patch: {
          tags: ['Loans'],
          summary: 'Update a loan',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    loan_amount: { type: 'number', example: 20000 },
                    actual_return_date: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Updated' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;