const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Loans API',
      version: '1.0.0',
      description: 'REST API для роботи з кредитами',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Loan: {
          type: 'object',
          required: ['client_id', 'loan_type_id', 'loan_amount'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '652a1b2c1234567890abcdef',
            },
            client_id: {
              type: 'string',
              description: 'ID клієнта',
              example: '652a1b2c1234567890abcdef',
            },
            loan_type_id: {
              type: 'string',
              description: 'ID типу кредиту',
              example: '652a1b3d1234567890fedcba',
            },
            loan_amount: {
              type: 'number',
              description: 'Сума кредиту',
              example: 150000.0,
            },
            issue_date: {
              type: 'string',
              format: 'date-time',
              description: 'Дата видачі',
            },
            scheduled_return_date: {
              type: 'string',
              format: 'date-time',
              description: 'Запланована дата повернення',
            },
            actual_return_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Фактична дата повернення',
            },
            payments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  payment_date: { type: 'string', format: 'date-time' },
                  amount: { type: 'number' },
                },
              },
            },
            fines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  accrual_date: { type: 'string', format: 'date-time' },
                  amount: { type: 'number' },
                  reason: { type: 'string' },
                  payment_date: { type: 'string', format: 'date-time' },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        DeletionLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            documentId: { type: 'string', description: 'ID видаленого документа' },
            modelType: { type: 'string', example: 'Loan' },
            deletedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            stack: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
