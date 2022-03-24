/* File formost of node/express operations */

const express = require('express');
// const { connect } = require('./public/scripts/dbconfig');
const app = express();
var path = require('path')
var http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var bodyParser = require('body-parser'); 
app.use(bodyParser.json());
const sayHi = require('./public/scripts/dbconfig');
const mysql = require('mysql2')
var port = process.env.PORT;
var query;
console.log(port)
var ticket_id;

//5005

app.get('/', (req, res) =>{
    console.log("WORK")
    res.send("<h1>Hi</h1>")
    // res.render('login.html')

});

app.get('/faq.html', (req, res) =>{
    console.log("faq")
    // res.sendFile(path.join(__dirname +  '/faq.html'));
    // res.render('login.html')

    const con = require('./public/scripts/dbconfig');
    
    con.query("SELECT ticket.status, ticket.problem_description, problem_type.name FROM ticket INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id", 
    function(err, result, fields) {
        if (err) throw err;
        console.log(result);

        if (result.length>0) {
            res.render('faq', {
                dropdownVals: result
               
                // ticket_details: result
    
            });
            //     dropdownVals: query_output,
            //     newdropdownVals: query,
            //     // problem_resolution: result
            // })
        }
    });
});


app.get('/login.html', (req, res) =>{
    console.log("login")
    res.sendFile(path.join(__dirname +  '/login.html'));
    // res.render('login.html')

});

app.get('/account.html', (req, res) =>{
    console.log("account")
    res.sendFile(path.join(__dirname +  '/account.html'));
    // res.render('login.html')

});

app.get('/login.html', (req, res) =>{
    console.log("analyst")
    res.sendFile(path.join(__dirname +  '/analyst.html'));
    // res.render('login.html')

});

app.post('/auth', (req, res) =>{
    const con = require('./public/scripts/dbconfig');
	let username = req.body.username;
	let password = req.body.password;

	if (username && password) {

		con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {

			if (error) throw error;

			if (results.length > 0) {

				req.session.loggedin = true;
				req.session.username = username;

				res.redirect('/faq.html');
			} else {
				res.send('Login credentials incorrect.');
			}			
			res.end();
		});
	} else {
		response.send('Please enter username and password.');
		response.end();
	}
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

        query = result

        // console.log(result);
        // for(i = 0; i< 5; i++){
        //     console.log(result[i]);

        // }
    


        // const table = document.querySelector('ticket-body employee-ticket-body');
        con.end();
    });

    

    console.log(ticket_id);
        con.query(`SELECT ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler from ticket
        INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
        INNER JOIN  software on ticket.software_id = software.software_id 
        INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
        INNER JOIN (SELECT user_id, employee.name FROM handler
        INNER JOIN employee ON handler.user_id = employee.employee_id
        UNION
        SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
        WHERE ticket_id = 1;`,[ticket_id],function (err, result, fields) {
        if (err) throw err;
        
        console.log(result)

        res.render('index', {
            dropdownVals: query_output,
            newdropdownVals: query,
            // ticket_details: result

        })


        io.on('connection',  (socket) => {
            console.log('connected')
            socket.on("message", (msg) => {
                console.log(parseInt(msg.id));
                // ticket_id = parseInt(msg.id);
                io.send('message', result);
                // io.emit('ticket_details', msg);
    
            })


            
            // console.log(socket.id);
        });
        // io.on('connection', function() {
        //     io.send('message', json);
        //   });
        
    });


    //killall -9 node
    
});
// var port = normalizePort(process.env.PORT);
// app.set('port', port);

server.listen(5005, () => {
    console.log('listening for requests on port 5005');
});

// app.listen(5005, ()=>console.log(' SERVER CONNECTED '))