const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config');

const indexRouter = require('./src/routes');
const loansRouter = require('./src/routes/loans');

const connectDB = require('./src/config/db.config');

connectDB().catch((err) => {
  console.error(err);
  process.exit(1);
});

const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use('/', indexRouter);
app.use('/api/loans', loansRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  const { message = 'Internal Server Error', status = 500, stack } = err || {};

  console.error(message);

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
  });
}

module.exports = app;