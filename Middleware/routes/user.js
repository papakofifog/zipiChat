const express= require('express');
const router= Router();
const { registeUser }= require('../../Controller/userRegistration');

router.post('/signUp/', registeUser);