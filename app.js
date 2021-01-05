const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// Charge route
app.post('/charge', (req, res) => {
  const amount = 5000;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: 'Web Development Book',
        currency: 'eur',
        customer: customer.id,
      }),
    )
    .then(() => res.render('success'))
    .catch((error) => console.error(error));
});

// Set port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
