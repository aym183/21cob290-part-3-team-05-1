/* File formost of node/express operations */

const express = require('express');
const { connect } = require('./public/scripts/dbconfig');
const app = express()
var path = require('path')
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.set('views', __dirname);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const sayHi = require('./public/scripts/dbconfig');
const mysql = require('mysql2')
var port = process.env.PORT;
var query;
console.log(port)

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

});

app.get('/index.html', (req, res) => {  
    console.log("index")
    // res.writeHead(200, {'content-type':'text/html'})
    
    const con = require('./public/scripts/dbconfig');

    con.query(`SELECT ticket_id, status, last_updated, problem_type.name, h.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    INNER JOIN employee ON ticket.employee_id = employee.employee_id
    INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
    WHERE ticket.employee_id = 2005
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'unsuccessful' THEN 4
                WHEN status = 'active' THEN 5
                ELSE 6 END`, 
    function (err, result, fields) {
        if (err) throw err;
        // console.log(result);

        query_output = result;

        console.log(result);
        // for(i = 0; i< 5; i++){
        //     console.log(result[i]);

        // }

        // res.render('index', {
        //     dropdownVals: result,

        // })


        // const table = document.querySelector('ticket-body employee-ticket-body');
        con.end();
    });

    con.query(`SELECT ticket_id, status, problem_type.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    WHERE ticket.employee_id = 2005
    ORDER BY CASE WHEN status = 'dropped' THEN 1
                WHEN status = 'submitted' THEN 2
                WHEN status = 'pending' THEN 3
                WHEN status = 'unsuccessful' THEN 4
                WHEN status = 'active' THEN 5
                ELSE 6 END`, 
    function (err, result, fields) {
        if (err) throw err;
        // console.log(result);

        console.log(result);
        // for(i = 0; i< 5; i++){
        //     console.log(result[i]);

        // }
        res.render('index', {
            dropdownVals: query_output,
            newdropdownVals: result,

        })
        // const table = document.querySelector('ticket-body employee-ticket-body');
        con.end();
    });


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

    // const con = require('./dbconfig');

    // con.query("SELECT * from ticket", function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result);

    //     const table = document.querySelector('ticket-body employee-ticket-body');
    // });

    // con.end();

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


// port
app.listen(5005)