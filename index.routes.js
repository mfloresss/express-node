const { readFileSync, writeFileSync } = require("fs");
const { generateId, findContact } = require("./helpers");

const route = require("express").Router();

const contacts = readFileSync("./contacts.json").length
  ? JSON.parse(readFileSync("./contacts.json"))
  : [];

const path = "./contacts.json";

route.get("/api/contacts", (req, res) => {
  try {
    if (contacts.length) return res.status(200).send(contacts);

    res.status(404).send({ detail: "Contacts not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.get("/api/contacts/:id", (req, res) => {
  try {
    const contactFind = contacts.find(({ id }) => id === req.params.id);

    if (contactFind) return res.status(200).send(contactFind);

    res.status(404).send({ detail: "Contact not found" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

route.post("/api/contacts", (req, res) => {
  try {
    const contact = req.body;

    if (
      contact.hasOwnProperty("name") &&
      contact.hasOwnProperty("age") &&
      contact.hasOwnProperty("email")
    ) {
      const contactExist = contacts.find(
        ({ email }) => email === contact.email
      );
      if (!contactExist) {
        const newContactId = generateId({ length: 30 });

        contacts.push({ id: newContactId, ...contact });

        writeFileSync(path, JSON.stringify(contacts), (err) => {
          throw new Error(err);
        });

        return res
          .status(201)
          .send(contacts.find(({ id }) => id === newContactId));
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

route.put("/api/contacts/:email", (req, res) => {
  try {
    const { indexContact, contactData } = findContact({
      contacts,
      email: req.params.email,
    });
    const contact = req.body;

    if ((indexContact && contactData) !== undefined) {
      const newData = {
        ...contactData,
        ...contact,
      };

      if (
        contact.hasOwnProperty("name") &&
        contact.hasOwnProperty("age") &&
        contact.hasOwnProperty("email")
      ) {
        const contactExist = contacts.find(
          ({ email }) => email === newData.email
        );

        if (!contactExist) {
          contacts[indexContact] = newData;

          writeFileSync(path, JSON.stringify(contacts), (err) => {
            throw new Error(err);
          });

          return res
            .status(201)
            .send(contacts.find(({ id }) => id === newData.id));
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
  const { id } = req.params;
  try {
    const newContactsList = [];
    if (contacts.find((contact) => contact.id === id)) {
      for (i = 0; i < contacts.length; i++) {
        if (contacts[i].id !== id) newContactsList.push(contacts[i]);
      }
      const contactRemove = contacts.find((contact) => contact.id === id);

      writeFileSync(path, JSON.stringify(newContactsList), (err) => {
        throw new Error(err);
      });

      return res.status(201).send(contactRemove);
    }
    res.status(400).send({ detail: "Contact not found" });
    console.log(newContactsList);
  } catch (err) {
    console.log(err);
    res.status(500).send({ detail: err });
  }
});

module.exports = route;
