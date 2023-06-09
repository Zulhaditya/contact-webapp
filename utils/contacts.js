const fs = require('fs');

// create folder if not exists
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// create contact.json if not exists
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// get data in contact.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// find contact by names
const findContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  return contact;
};

// replace contact.json with new data
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// add new contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// check for duplicate names
const checkDuplicate = (name) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.name === name);
};

// delete contact
const deleteContact = (name) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);

  saveContacts(filteredContacts);
};

// edit contacts
const updateContacts = (newContact) => {
  const contacts = loadContact();
  // remove old contacts with the same name as oldname
  const filteredContacts = contacts.filter(
    (contact) => contact.name !== newContact.oldName
  );
  delete newContact.oldName;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContacts,
};
