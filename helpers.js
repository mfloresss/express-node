// Humilde

// const generateId = (contacts) => {
//   if (contacts.length) {
//     const { id } = contacts[contacts.length - 1];
//     return id + 1;
//   }

//   return 1;
// };

const generateId = ({ length }) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMabcdefghijklm0123456789-";

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));

  return result;
};

const findContact = ({ contacts, email }) => {
  const indexContact = contacts.findIndex((contact) => contact.email === email);
  const contactData = contacts.find((contact) => contact.email === email);

  return { indexContact, contactData };
};

// const handdleContact = (contact, contacts, method) => {
//   if (contact.hasOwnProperty("name", "age", "email")) {
//     const path = "./contacts.json";
//     const contactExist = contacts.find(({ email }) => email === contact.email);

//     if (method === "POST") {
//       const { indexContact, contactData } = findContact(contact.email);
//       if ((indexContact && contactData) !== undefined) {
//         const newData = {
//           ...contactData,
//           ...contact,
//         };
//       }
//     }

//     if (!contactExist) {
//       contacts[indexContact] = newData;

//       writeFileSync(path, JSON.stringify(contacts), (err) => {
//         throw new Error(err);
//       });

//       res.status(201).send(contacts.find(({ id }) => id === newData.id));
//     }
//     res.status(400).send({
//       detail: "Already exist a person with same email",
//     });
//   }
//   res.status(406).send({ detail: "Name, age and email is required" });

//   res.status(406).send({ detail: "Contact not found" });
// };

module.exports = { generateId, findContact };
