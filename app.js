const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
const { loadContact, findContact } = require('./utils/contacts');

app.set('view engine', 'ejs');

// third-party middleware
app.use(expressLayouts);

// built-in middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  const biodata = [
    {
      nama: 'Zulhaditya Hapiz',
      email: 'zulhaditya@gmail.com',
    },
    {
      nama: 'Inayah Wulandari',
      email: 'inayah@gmail.com',
    },
    {
      nama: 'Killua Zoldyck',
      email: 'killua@gmail.com',
    },
  ];

  res.render('index', {
    nama: 'Hapiz',
    title: 'Home',
    biodata,
    layout: 'layouts/main-layout',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    layout: 'layouts/main-layout',
  });
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    title: 'Contact',
    layout: 'layouts/main-layout',
    contacts,
  });
});

app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name);
  res.render('detail', {
    title: 'Detail',
    layout: 'layouts/main-layout',
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send('<h1>404 not found!</h1>');
});

app.listen(port, () => {
  console.log(`Web server berjalan di http://localhost:${port}...`);
});
