const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
const {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContacts,
} = require('./utils/contacts');

const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.set('view engine', 'ejs');

// third-party middleware
app.use(expressLayouts);

// built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// config flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
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
    msg: req.flash('msg'),
  });
});

// route to add contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form add contact',
    layout: 'layouts/main-layout',
  });
});

// process data contact
app.post(
  '/contact',
  [
    body('name').custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error('Contact name already in use!');
      }
      return true;
    }),
    check('email', 'Invalid email!').isEmail(),
    check('phone', 'Invalid phone number!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // send flash message
      req.flash('msg', 'Contact successfully added!');
      res.redirect('/contact');
    }
  }
);

// route for delete contact
app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name);

  // if contact not exist
  if (!contact) {
    res.status(404);
    res.send('<h1>404</h1');
  } else {
    deleteContact(req.params.name);
    // send flash message
    req.flash('msg', 'Contact successfully deleted!');
    res.redirect('/contact');
  }
});

// route to edit contact
app.get('/contact/edit/:name', (req, res) => {
  const contact = findContact(req.params.name);

  res.render('edit-contact', {
    title: 'Form edit contact',
    layout: 'layouts/main-layout',
    contact,
  });
});

// process for edit contact
app.post(
  '/contact/update',
  [
    body('name').custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldName && duplicate) {
        throw new Error('Contact name already in use!');
      }
      return true;
    }),
    check('email', 'Invalid email!').isEmail(),
    check('phone', 'Invalid phone number!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Edit contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      // send flash message
      req.flash('msg', 'Contact successfully edited!');
      res.redirect('/contact');
    }
  }
);

// route to detail contact
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
  console.log(`Web server started on http://localhost:${port}...`);
});
