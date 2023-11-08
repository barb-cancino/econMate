const express = require('express')
const path = require('path')
const app = express()
const t2p = require('./public/js/t2p_functions.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

let solucion

app.get('/', (req, res) => { 
    res.render('index');
})

app.get('/t2p', (req, res) => { 
    solucion = t2p.t2pSolucion(0)
    res.render('t2p', {solucion});
})

app.get('/t2p/solucion', (req, res) => { 
    res.render('index', {solucion});
})

app.post('/t2p/solucion', (req, res) => {
    // Retrieve data from the form
    const parametros = req.body;
    // Use the form data to create or modify the variable
    solucion = t2p.t2pSolucion(parametros);
    // Send the variable as a JSON response
    res.json({ parametros, solucion });
    res.redirect('/solucion')
});

app.listen(3000, () => { 
    console.log("Lisening on port 3000")
})