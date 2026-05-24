const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Loan = require('../models/Loan');
const DeletionLog = require('../models/DeletionLog');

const validLoan = {
  client_id: '652a1b2c1234567890abcdef',
  loan_type_id: '652a1b3d1234567890fedcba',
  loan_amount: 100000,
  issue_date: '2024-01-01T00:00:00.000Z',
  scheduled_return_date: '2025-01-01T00:00:00.000Z',
};

const invalidLoan = {
  client_id: 'invalid',
  loan_amount: -50,
};

beforeAll(async () => {
  await Loan.deleteMany({});
  await DeletionLog.deleteMany({});
});

afterEach(async () => {
  await Loan.deleteMany({});
  await DeletionLog.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/loans', () => {
  it('should return empty array when no loans', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      count: 0,
      data: [],
    });
  });
});

describe('POST /api/loans/new', () => {
  it('should create a new loan with valid data', async () => {
    const res = await request(app)
      .post('/api/loans/new')
      .send(validLoan)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        client_id: validLoan.client_id,
        loan_type_id: validLoan.loan_type_id,
        loan_amount: validLoan.loan_amount,
      },
    });
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/loans/new')
      .send(invalidLoan)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
    });
    expect(res.body.message).toBeDefined();
  });
});

describe('DELETE /api/loans/:id', () => {
  it('should delete a loan and create deletion log', async () => {
    const loan = await Loan.create(validLoan);

    const res = await request(app).delete(`/api/loans/${loan._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Loan deleted',
    });
    expect(res.body.data).toHaveProperty('_id', loan._id.toString());

    const log = await DeletionLog.findOne({ documentId: loan._id });
    expect(log).toBeTruthy();
    expect(log.modelType).toBe('Loan');
    expect(log.deletedAt).toBeDefined();
  });

  it('should return 404 for non-existent id', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).delete(`/api/loans/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Loan not found',
    });
  });
});
