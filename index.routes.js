const { readFileSync, writeFileSync } = require("fs");
const { generateId, findContact } = require("./helpers");

const route = require("express").Router();

const contacts = readFileSync("./contacts.json").length
  ? JSON.parse(readFileSync("./contacts.json"))
  : [];

const path = "./contacts.json";

route.get("/api/contacts", (req, res) => {
  try {
    if (contacts.length) {
      console.log({ GET: contacts });
      return res.status(200).send(contacts);
    }

    res.status(404).send({ detail: "Contacts not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.get("/api/contacts/:id", (req, res) => {
  try {
    const contactFind = contacts.find(({ id }) => id === req.params.id);

    if (contactFind) {
      console.log({ GET: contactFind });
      return res.status(200).send(contactFind);
    }

    res.status(404).send({ detail: "Contact not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.post("/api/contacts", (req, res) => {
  try {
    const contact = req.body;

    if (contact.name && contact.age && contact.email) {
      const contactExist = contacts.find(
        ({ email }) => email === contact.email
      );
      if (!contactExist) {
        const newContact = { id: generateId({ length: 30 }), ...contact };

        contacts.push(newContact);
        writeFileSync(path, JSON.stringify(contacts), (err) => {
          throw new Error(err);
        });

        console.log({ POST: newContact });
        return res.status(201).send(newContact);
      }
      return res
        .status(400)
        .send({ detail: "Already exist a person with same email" });
    }
    res.status(406).send({ detail: "Name, age and email is required" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.put("/api/contacts/:id", (req, res) => {
  try {
    const { indexContactFind, contactDataFind } = findContact({
      contacts,
      id: req.params.id,
    });

    const contactData = req.body;

    if ((indexContactFind && contactDataFind) !== undefined) {
      const newData = {
        ...contactDataFind,
        ...contactData,
      };

      if (contactData.name && contactData.age && contactData.email) {
        const contactExist = contacts.find(
          ({ email }) => email === newData.email
        );

        if (!contactExist) {
          contacts[indexContactFind] = newData;

          writeFileSync(path, JSON.stringify(contacts), (err) => {
            throw new Error(err);
          });

          console.log({ PUT: newData });
          return res.status(201).send(newData);
        }
        return res.status(400).send({
          detail: "Already exist a person with same email",
        });
      }
      return res
        .status(406)
        .send({ detail: "Name, age and email is required" });
    }
    res.status(406).send({ detail: "Contact not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.delete("/api/contacts/:id", (req, res) => {
  try {
    const { id } = req.params;

    let newContactsList = [];
    const contactExist = contacts.find((contact) => contact.id === id);

    if (contactExist) {
      newContactsList = contacts.filter((contact) => contact.id !== id);

      writeFileSync(path, JSON.stringify(newContactsList), (err) => {
        throw new Error(err);
      });

      console.log({ DELETE: contactExist });
      return res.status(201).send(contactExist);
    }
    res.status(400).send({ detail: "Contact not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

module.exports = route;
