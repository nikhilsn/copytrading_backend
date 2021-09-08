const express = require('express');
const app= express();
const port= 3000;

//ROUTES FROM OTHER FILES
const login = require('./authentication/login');
const register = require('./authentication/register');

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:true, parameterLimit:50000}));
app.use(login);
app.use(register);

app.get('/' , (req , res)=>{

    res.send('Quicktrades Coptrading Platform')

})

app.listen(port, ()=>{
    console.log('Listing to port: 3000');
})