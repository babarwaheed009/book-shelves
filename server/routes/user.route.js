const express = require('express');
const { getUsers, signIn, signUp, logout, deleteUser } = require('../controllers/user.controller');
const validateRequest = require('../middleware/validation.middleware');
const { signUpSchema, signInSchema,  } = require('../schema/user.schema');
const auth = require('../middleware/auth.middleware');
const app = express();

app.get('/users',auth, getUsers);
app.post('/signup',validateRequest(signUpSchema, 'body'),  signUp);
app.post('/login',validateRequest(signInSchema, 'body'),  signIn);
app.delete('/users/:id', deleteUser);
app.post('/logout',auth,  logout);

module.exports = app;