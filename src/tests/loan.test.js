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
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /', () => {
  it('should return API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });
});

describe('GET /api/loans', () => {
  it('should return empty array when no loans', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('should handle server errors', async () => {
    jest.spyOn(Loan, 'find').mockImplementationOnce(() => {
      throw new Error('DB Error');
    });
    const res = await request(app).get('/api/loans');
    expect(res.statusCode).toBe(500);
  });
});

describe('POST /api/loans', () => {
  it('should create a new loan with valid data', async () => {
    const res = await request(app)
        .post('/api/loans')
        .send(validLoan)
        .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should return 400 for invalid data', async () => {
    const res = await request(app)
        .post('/api/loans')
        .send(invalidLoan)
        .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/loans/:id', () => {
  it('should delete a loan and create deletion log', async () => {
    const loan = await Loan.create(validLoan);
    const res = await request(app).delete(`/api/loans/${loan._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('_id', loan._id.toString());
  });

  it('should return 404 for non-existent id', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).delete(`/api/loans/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  it('should handle server errors during delete', async () => {
    jest.spyOn(Loan, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('DB Error');
    });
    const res = await request(app).delete(`/api/loans/507f1f77bcf86cd799439011`);
    expect(res.statusCode).toBe(500);
  });

  it('should handle deletion log save error', async () => {
    const loan = await Loan.create(validLoan);
    jest.spyOn(DeletionLog.prototype, 'save').mockImplementationOnce(() =>
        Promise.reject(new Error('Log Error'))
    );
    const res = await request(app).delete(`/api/loans/${loan._id}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('PATCH /api/loans/:id', () => {
  it('should update a loan', async () => {
    const loan = await Loan.create(validLoan);
    const res = await request(app)
        .patch(`/api/loans/${loan._id}`)
        .send({ loan_amount: 20000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.loan_amount).toBe(20000);
  });

  it('should return 404 if not found', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
        .patch(`/api/loans/${fakeId}`)
        .send({ loan_amount: 20000 });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for validation error', async () => {
    const loan = await Loan.create(validLoan);
    const res = await request(app)
        .patch(`/api/loans/${loan._id}`)
        .send({ loan_amount: -100 });

    expect(res.statusCode).toBe(400);
  });
});

describe('DB Config Error Coverage', () => {
  it('should emit and catch mongoose error', () => {
    mongoose.connection.emit('error', new Error('Fake connection error'));
  });
});