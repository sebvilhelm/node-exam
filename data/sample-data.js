const faker = require('faker');
const { sequelize, User } = require('../models');
const bcrypt = require('bcrypt');
require('dotenv').config();

if (process.env.NODE_ENV !== 'development') {
  console.log('WARNING!!');
  console.log('Never run this script in production');
  process.exit();
}

const getRandomPhoneNumber = () => [...Array(8)].map(() => Math.floor(Math.random() * 9)).join('');

const createUserArray = length =>
  [...Array(length)].map(() => ({
    name: faker.name.findName(),
    email: faker.internet.exampleEmail(),
    password: bcrypt.hashSync(faker.internet.password(), 12),
    phoneNumber: getRandomPhoneNumber(),
    photo: faker.image.avatar(),
  }));

async function createSampleData() {
  const anyUser = await User.find();
  if (anyUser) {
    throw new Error("Don't run this script, if you have users in your database!");
  }
  console.log("Connected to database. Let's generate some users");
  const users = createUserArray(10);
  console.log('Users generated, adding to the database...');
  await User.bulkCreate(users);
  console.log('Sample data added to database!');
  process.exit();
}

async function deleteData() {
  console.log('Removing all the data!');
  await User.destroy({ where: {} });
  console.log('Bye bye');
  process.exit();
}

sequelize
  .sync()
  .then(async () => {
    if (process.argv.includes('--delete')) {
      await deleteData();
    } else {
      await createSampleData();
    }
  })
  .catch(err => {
    console.log('Something went wrong');
    console.log(err);
    process.exit();
  });
