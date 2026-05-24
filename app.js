const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./MongooseJsTemplate-main/config/swagger.config');

const indexRouter = require('./MongooseJsTemplate-main/routes');
const loansRouter = require('./MongooseJsTemplate-main/routes/loans');

const connectDB = require('./MongooseJsTemplate-main/config/db.config');

connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/loans', loansRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res) => {
  const { message = 'Internal Server Error', status = 500, stack } = err || {};

  console.error('Error:', message);

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? stack : undefined,
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
