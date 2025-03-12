// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).json({'msg': 'hello welcome to home page'})
    // res.send(`<h1>Home Page</h1>`)
})

app.get('/search', (req, res) => {
    const query = req.query.name;

    res.status(200).json({'msg': `Search results for ${query}`})
})

app.post('/login', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(name && email && password){
        res.status(200).json({'msg': 'Login Successfull', "name": name, "email": email, "password": password})
    }else{
        res.status(400).json({'msg': 'Please provide all the required fields'})
    }
})

app.put('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const DatabaseID = 1;
    if(!id){
        res.status(400).json({'msg': 'Please provide the id'})
    }else if(id !== DatabaseID){
        res.status(404).json({'msg': 'No Record Found'})
    }else{
        res.status(200).json({'msg': 'Record Updated'})
    }
})

app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if(!id){
        res.status(400).json({'msg': 'Please provide the id'})
    }else{
        res.status(200).json({'msg': 'Record Deleted'})
    }
})

const PORT = process.env.port;

app.listen(PORT, () => {
    console.log(`Server is listening in Port: ${PORT}`);
})