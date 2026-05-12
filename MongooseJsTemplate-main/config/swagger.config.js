const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API',
            version: '1.0.0',
            description: 'REST API для роботи з книгами з логуванням видалень',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    required: ['title', 'author'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '65f8a1b2c3d4e5f6a7b8c9d0',
                        },
                        title: {
                            type: 'string',
                            description: 'Назва книги',
                            example: '1984',
                        },
                        author: {
                            type: 'string',
                            description: 'Автор книги',
                            example: 'George Orwell',
                        },
                        year: {
                            type: 'integer',
                            description: 'Рік видання',
                            example: 1949,
                            minimum: 1000,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата створення',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Дата останнього оновлення',
                        },
                    },
                },
                DeletionLog: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '65f8a1b2c3d4e5f6a7b8c9d1' },
                        documentId: {
                            type: 'string',
                            description: 'ID видаленого документа',
                            example: '65f8a1b2c3d4e5f6a7b8c9d0'
                        },
                        modelType: {
                            type: 'string',
                            example: 'Book'
                        },
                        deletedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-10T12:00:00.000Z'
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        stack: { type: 'string', description: 'Stack trace (тільки в development)' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;