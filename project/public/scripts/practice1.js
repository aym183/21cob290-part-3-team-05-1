/* File formost of node/express operations */

const express = require('express');
const { connect } = require('./dbconfig');
const app = express()
var path = require('path')
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const sayHi = require('./dbconfig');
const mysql = require('mysql2')
var port = process.env.PORT;
console.log(port)

var query_output;

//5005

app.get('/', (req, res) =>{
    console.log("WORK")
    res.send("<h1>Hi</h1>")
    // res.render('login.html')

});

app.get('/faq.html', (req, res) =>{
    console.log("faq")
    res.sendFile(path.join(__dirname +  '/faq.html'));
    // res.render('login.html')
    const con = require('./dbconfig');
    con.query("SELECT problem_type.name from ticket INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id where employee_id = 2014;", function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        query_output = result;
        console.log(result[0].status);
        // for(i = 0; i< 5; i++){
        //     console.log(result[i]);

        // }
        res.render('faq', {
            dropdownVals: result
        })
        // const table = document.querySelector('ticket-body employee-ticket-body');
        con.end();
    });


});

app.get('/index', (req, res) => {  
    console.log("index")
    const con = require('./dbconfig');

    con.query("SELECT status, ticket_id, problem_type.name, last_updated, handler_id from ticket INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id where employee_id = 2013;", function (err, result, fields) {
        if (err) throw err;
        // console.log(result);
        query_output = result;
        console.log(result[0].status);
        // for(i = 0; i< 5; i++){
        //     console.log(result[i]);

        // }
        res.render('index', {
            dropdownVals: result
        })
        // const table = document.querySelector('ticket-body employee-ticket-body');
        con.end();
    });
    
/*
    app.get('/external', (req, res) => {
        console.log("external")
        const con = require('./dbconfig');

        con.query(";", function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            query_output = result;
            console.log(result[0].status);
            // for(i = 0; i< 5; i++){
            //     console.log(result[i]);

            // }
            res.render('external', {
                dropdownVals: result
            })
            // const table = document.querySelector('ticket-body employee-ticket-body');
            con.end();
        });
   */ 


    // res.writeHead(200, {'content-type':'text/html'})
    
    // res.render('index.html');
    // res.sendFile(path.join(__dirname +  '/index.html'));
    // res.end()
    // console.log('user here')
    // console.log(sayHi)
    

    // res.send("i here")
    // res.end()
    // sayHi.getConnection((err, connection) => {
    //     // if(err) throw err
    //     console.log(`connected as id ${connection.threadID}`)
    //     connection.query('SELECT * from ProblemType', (err, rows) => {
    //         connection.release()
            
    //         res.send(rows)
        

    //     })
    // })

   

    // sayHi.query("{SELECT * from ProblemType", function (err, result, fields) {
    //     // if (err) throw err;
    //     console.log(result);
    //     res.end(result)
    // });
    
    // sayHi.end();


    //killall -9 node
    
});
// var port = normalizePort(process.env.PORT);
// app.set('port', port);



app.listen(port)