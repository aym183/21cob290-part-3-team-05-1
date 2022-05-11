/* File formost of node/express operations */

const express = require('express');
// const { connect } = require('./public/scripts/dbconfig');
const app = express();
var path = require('path')
var http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);
let alert = require('alert'); 
const con = require('./public/scripts/dbconfig');

require('events').EventEmitter.defaultMaxListeners = 15;
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var bodyParser = require('body-parser'); 
const session = require("express-session");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
const sayHi = require('./public/scripts/dbconfig');
const mysql = require('mysql2');
const { add } = require('nodemon/lib/rules');
var port = process.env.PORT;
var query;
var session_id;
var session_username;
var session_job;
var session_tickets;
var ticket_id;
var submit_solution;
var handler_id;
var problem_type_id;
var last_updated;
var software_id;
var ticket_status;
var solution_id2;
var ext_spec_id;
var hardware_datalist;
var operating_system;
var software_datalist;
var prob_type_vals;
var handlers;
var handler_list = [];

app.use (session ({
    secret: "secret",
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie:{
     maxAge: 1000*60*60 // default session expiration is set to 1 hour
     },
 })
);

app.get('/', (req, res) =>{
    res.redirect('login.html')
});

app.get('/faq.html', (req, res) =>{
    if(req.session.loggedin && session_job == "Employee") {

    con.query(`SELECT hardware_id from hardware;`, function (err, result, fields) {
        if (err) throw err;
        hardware_id = result;      
    });

    con.query(`SELECT name from operating_system;`, function (err, result, fields) {
        if (err) throw err;
        operating_system = result;
    });

    con.query(`SELECT name from software;`, function (err, result, fields) {
        if (err) throw err;
        software_datalist = result;
    });

    con.query(`SELECT name from problem_type;`, function (err, result, fields) {
        if (err) throw err;
        prob_type_vals = result;
    });

    con.query(`SELECT employee.name, count(ticket_id) as "tickets" from ticket INNER JOIN handler ON ticket.handler_id = handler.user_id
    INNER JOIN employee ON handler.user_id = employee.employee_id
    WHERE ticket.status != 'closed'
    GROUP BY handler_id
    UNION
    SELECT external_specialist.name, count(ticket_id) from ticket INNER JOIN handler on ticket.handler_id = handler.user_id
    INNER JOIN external_specialist on external_specialist_id = handler.user_id
    WHERE ticket.status != 'closed'
    GROUP BY ticket.handler_id;`, function (err, result, fields) {
        if (err) throw err;
        handlers = result;
        
    });
    
    con.query(`SELECT ticket.problem_description, 'Hardware' as 'prob_name', problem_type.name
    from ticket 
    INNER JOIN problem_type ON problem_type.problem_type_id = ticket.problem_type_id 
    INNER JOIN ticket_solution ON ticket_solution.ticket_id=ticket.ticket_id
    INNER JOIN solution ON ticket_solution.solution_id=solution.solution_id
    where (links_to LIKE '2%' OR problem_type.problem_type_id = 2) AND (ticket_solution.solution_status='successful')

    UNION ALL

    SELECT ticket.problem_description, 'Software' as 'prob_name', problem_type.name
    from ticket 
    INNER JOIN problem_type ON problem_type.problem_type_id = ticket.problem_type_id
    INNER JOIN ticket_solution ON ticket_solution.ticket_id=ticket.ticket_id
    INNER JOIN solution ON ticket_solution.solution_id=solution.solution_id
    where (links_to LIKE '1%' OR problem_type.problem_type_id = 1) AND (ticket_solution.solution_status='successful');`,
    
    function(err, result, fields) {
        if (err) throw err;

        if (result.length>0) {
            res.render('faq', {
                dropdownVals: result,
                loggeduser: session_username,
                hardwareids: hardware_id,
                operating_sys: operating_system,
                software_vals: software_datalist,
                probtype_vals: prob_type_vals,
                handler_vals: handlers       
            });
           
        }
        
    });

    io.on('connection',  (socket) => {
        socket.on("solution_details", (msg) => {
            con.query(`SELECT ticket.problem_description, ticket.notes, problem_type.name, solution.solution_description 
            FROM solution 
            INNER JOIN ticket_solution ON solution.solution_id = ticket_solution.solution_id 
            INNER JOIN ticket ON ticket_solution.ticket_id = ticket.ticket_id 
            INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id
            WHERE ticket.problem_description = ?
            AND ticket_solution.solution_status = 'successful';`,
            [msg.problem_description],function(err, result, fields) {
            if (err) throw err;
            socket.emit('solution_details', result[0]);
            })
        });
        })
    io.on('connection',  (socket) => {
        socket.on("employeeName", (msg) => {
            con.query(`SELECT name from employee 
            INNER JOIN users ON users.user_id  = employee.employee_id 
            WHERE users.username = ? `,
            [session_username],function(err, result, fields) {

            if (err) throw err;
            socket.emit('employeeName', result[0]);
            })
        });
        })

    io.on('connection',  (socket) => {
        socket.on("add_ticket", (msg) => {
           
            con.query(`SELECT problem_type_id from problem_type where name = ?;`,[msg.prob_type],function (err, result, fields) {
                if (err) throw err;
                problem_type_id = result[0].problem_type_id;
                
                con.query(`SELECT software_id from software where name = ?;`,[msg.soft_name],function (err, result, fields) {
                    if (err) throw err;
                    software_id = result[0].software_id;
                    
                    con.query(`SELECT user_id from handler INNER JOIN employee ON employee.employee_id  = handler.user_id WHERE employee.name = ?
                    UNION
                    SELECT external_specialist_id AS user_id FROM external_specialist WHERE name = ?`,[msg.h_name,msg.h_name],function (err, result, fields) {
                        if (err) throw err;
                        handler_id = result[0].user_id;

                        con.query(`SELECT employee_id from employee INNER JOIN users ON users.user_id  = employee.employee_id WHERE users.username = ?;`,[session_username],function (err, result, fields) {
                            if (err) throw err;
                            employee_id = result[0].employee_id;
                        
                            con.query(`INSERT INTO ticket (employee_id, status, priority, problem_description, notes, creation_date, last_updated, handler_id, operating_system, hardware_id, software_id, problem_type_id)
                            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [employee_id, msg.statuss, msg.priorityy, msg.prob_desc, msg.notess, msg.date, msg.date, handler_id, msg.os, parseInt(msg.hardID), software_id, problem_type_id], function (err, result, fields) {

                                socket.disconnect(0);
                    
                                if (err) throw err;
                            });
                        });
                    });
                });
            });
        });
    });

} else {
    res.redirect('/login.html');
}});


app.get('/login.html', (req, res) =>{
     res.render('login')
});



app.get('/analyst.html', (req, res) =>{
    if(req.session.loggedin && session_job == "Analyst") {
    con.query('SELECT job, COUNT(*) as `count` FROM employee GROUP BY job',function (err, result, fields) {
        if (err) throw err;
            query_chart1 = result;
    })

    con.query('SELECT priority, COUNT(*) as count FROM `ticket` GROUP BY priority',function (err, result, fields) {
        if (err) throw err;     
            query_chart3 = result;
    })

    con.query('SELECT solution_status, COUNT(*) as count FROM `ticket_solution` GROUP BY solution_status',function (err, result, fields) {
        if (err) throw err;
            query_chart4 = result;
    })


    con.query('SELECT status, COUNT(*) as count FROM `ticket` GROUP BY status', function(err, result, fields) {
        if (err) throw err;
        query_chart2 = result
        res.render('analyst', {
            dat1: query_chart1,
            dat4: query_chart2,
            dat7: query_chart3,    
            dat10: query_chart4,
        
        }) 
    })
    }}
)
app.get('/indepth.html', (req, res) =>{

    if(req.session.loggedin) {
       

    con.query(`SELECT
    SUM(CASE WHEN handler_id LIKE '1%' THEN 1 ELSE 0 END) AS external
    , SUM(CASE WHEN handler_id LIKE '2%' THEN 1 ELSE 0 END ) AS internal
    FROM ticket`,function (err, result, fields) {
        if (err) throw err;
            idc6 = result;
    })  


    con.query(`SELECT COUNT(*) as count, employee.name as name
    FROM ticket
        JOIN employee
        WHERE employee.employee_id = ticket.employee_id
        GROUP BY ticket.employee_id
        ORDER BY employee.name ASC`,function (err, result, fields) {
        if (err) throw err;
            
            idc5 = result;
    
    })   
        

    con.query(`SELECT COUNT(ticket.problem_type_id) as no, name
    FROM   problem_type
          JOIN ticket  
          WHERE problem_type.problem_type_id = ticket.problem_type_id
          GROUP BY problem_type.name
          ORDER BY name ASC`,function (err, result, fields) {
        if (err) throw err;
            
            idc4 = result;
    
    })

    con.query(`SELECT COUNT(ticket.ticket_id) as count, employee.name
    FROM   handler
          JOIN employee
          JOIN ticket  
          WHERE ticket.closing_date IS NOT NULL AND handler.user_id = ticket.handler_id AND employee.employee_id = handler.user_id
          GROUP BY employee.name
          ORDER BY employee.name ASC`,function (err, result, fields) {
        if (err) throw err;
            
            idc2 = result;
    
    })

    con.query(`SELECT COUNT(ticket.ticket_id) as count, employee.name
    FROM   handler
          JOIN employee
          JOIN ticket  
          WHERE ticket.status LIKE "dropped" AND handler.user_id = ticket.handler_id AND employee.employee_id = handler.user_id
          GROUP BY employee.name
          ORDER BY employee.name ASC`,function (err, result, fields) {
        if (err) throw err;
            
            idc3 = result;
    
    })


    con.query(`SELECT ticket.handler_id, COUNT(ticket.ticket_id) as count, employee.name
    FROM   handler
          JOIN employee
          JOIN ticket  
          WHERE ticket.closing_date IS NULL AND handler.user_id = ticket.handler_id AND employee.employee_id = handler.user_id
          GROUP BY employee.name
          ORDER BY employee.name ASC`,function (err, result, fields) {
        if (err) throw err;     
        idc1 = result;
        
        res.render('indepth', {
            dat1: idc1,
     
            dat4: idc2,
    
            dat7: idc3,
         
            dat10: idc4,
  
            dat13: idc5,
           
            dat16: idc6,
         
   
        })     
    })
}});


app.get('/intspecialist.html', (req, res) => {  
    if(req.session.loggedin && session_job == "Specialist") {
    // Query for ticket information

    con.query(`SELECT ticket_id, status, last_updated, problem_type.name, priority, h.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    INNER JOIN employee ON ticket.employee_id = employee.employee_id
    INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
    WHERE ticket.handler_id = ? and status != "dropped"
    ORDER BY CASE WHEN status = 'submitted' THEN 1
                WHEN status = 'unsuccessful' THEN 2
                WHEN status = 'active' THEN 3
                ELSE 4 END`, 
    [session_id],function (err, result, fields) {
        if (err) throw err;
        query_output = result;
    });

    con.query(`SELECT hardware_id from hardware;`, function (err, result, fields) {
        if (err) throw err;
        hardware_id = result;      
    });

    con.query(`SELECT name from operating_system;`, function (err, result, fields) {
        if (err) throw err;
        operating_system = result;
    });

    con.query(`SELECT name from software;`, function (err, result, fields) {
        if (err) throw err;
        software_datalist = result;
    });

    con.query(`SELECT name from problem_type;`, function (err, result, fields) {
        if (err) throw err;
        prob_type_vals = result;
    });

    con.query(`SELECT employee.name, count(ticket_id) from ticket INNER JOIN handler ON ticket.handler_id = handler.user_id
    INNER JOIN employee ON handler.user_id = employee.employee_id
    WHERE ticket.status != 'closed'
    GROUP BY handler_id
    UNION
    SELECT external_specialist.name, count(ticket_id) from ticket INNER JOIN handler on ticket.handler_id = handler.user_id
    INNER JOIN external_specialist on external_specialist_id = handler.user_id
    WHERE ticket.status != 'closed'
    GROUP BY ticket.handler_id;`, function (err, result, fields) {
        if (err) throw err;
        handlers = result;
    });

    con.query(`SELECT COUNT(ticket_id) FROM ticket WHERE ticket.handler_id = ? and status != "dropped"`,[session_id],
    function (err, result, fields) {
        if (err) throw err;

        session_tickets = (JSON.stringify(result)).substring(21, 22);
    });
   
    // Query to display home page info
    con.query(`SELECT ticket_id, status, problem_type.name  FROM ticket 
    INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
    WHERE ticket.handler_id = ? and status != "dropped"
    ORDER BY CASE WHEN status = 'submitted' THEN 1
    WHEN status = 'unsuccessful' THEN 2
    WHEN status = 'active' THEN 3
    ELSE 4 END`,  
    [session_id],function (err, result, fields) {
        if (err) throw err;

        query = result

        res.render('intSpecialist', {
            dropdownVals: query_output,
            newdropdownVals: query,
            loggeduser: session_username,
            hardwareids: hardware_id,
            operating_sys: operating_system,
            software_vals: software_datalist,
            probtype_vals: prob_type_vals,
            handler_vals: handlers        
        })
       
    });
// ``````condition that executed on calling of socket
    io.on('connection',  (socket) => {
        socket.on("message", (msg) => {
            if(msg.status == 'closed'){
                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, closing_time, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler, ticket_solution.solution_status,
                solution.solution_description from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                INNER JOIN  software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                if (err) throw err;

                io.send('message', result);

                });
            }

            else if(msg.status == 'active' || msg.status == 'unsuccessful'){

                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler
                from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN  software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id
                UNION
                SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                if (err) throw err;

                io.send('message', result);

                });

            }

            else if(msg.status == 'submitted'){

                
                con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler,
                solution.solution_description from ticket
                INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                INNER JOIN software on ticket.software_id = software.software_id 
                INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                INNER JOIN (SELECT user_id, employee.name FROM handler
                INNER JOIN employee ON handler.user_id = employee.employee_id)
                h ON ticket.handler_id = h.user_id
                WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                if (err) throw err;

                io.send('message', result);
                });

            }
                })
        })

    // updating of ticket
    io.on('connection',  (socket) => {
       
        socket.on("update_message", (msg) => {
        
            con.query(`SELECT problem_type_id from problem_type where name = ?;`,[msg.problem_type],function (err, result, fields) {
                if (err) throw err;
                problem_type_id = result[0].problem_type_id;
                
                con.query(`SELECT software_id from software where name = ?;`,[msg.software],function (err, result, fields) {
                if (err) throw err;
                software_id = result[0].software_id;
                
           
                    con.query(`SELECT user_id from handler INNER JOIN employee ON employee.employee_id  = handler.user_id WHERE employee.name = ?
                            UNION
                            SELECT external_specialist_id AS user_id FROM external_specialist WHERE name = ?`,[msg.handler_name,msg.handler_name],function (err, result, fields) {
                        if (err) throw err;
                        handler_id = result[0].user_id;


                        con.query(`UPDATE ticket 
                            SET priority = ?, operating_system = ?, problem_description = ?, notes = ?, hardware_id = ?, software_id = ?, problem_type_id = ?, last_updated =?,  handler_id = ? 
                            WHERE ticket_id = ?`, [msg.priority, msg.os, msg.problem_description, msg.notes, parseInt(msg.hardware_id), software_id, problem_type_id, msg.last_updated ,handler_id ,parseInt(msg.id)], function (err, result, fields) {
                           
                            if (err) throw err;
            });   
            });
        });
    });
        });
        })

    // Query to update tickets solution upon submission
    io.on('connection', (socket) => {
    
        socket.on("Submit-Ticket", (msg) => {

            con.query(`INSERT INTO solution (solution_description)
            values(?)`,[msg.solution], function (err, result, fields) {
                if (err) throw err;
            
            con.query(`UPDATE ticket
            SET status = 'submitted'
            WHERE ticket_id = ?`,[msg.id], function (err, result, fields) {
                if (err) throw err;
            
            con.query(`SELECT solution_id
            FROM solution
            WHERE solution_description = ?`,[msg.solution], function (err, result, fields){
                if (err) throw err;
                solution_id2 = result[0].solution_id
            

            con.query(`INSERT INTO ticket_solution
            values(?, ?, ?, ?)`,[msg.id, solution_id2, 'pending', session_id], function (err, result, fields) {
                if (err) throw err;
            });
            });
        });
            });
        })
})

    //Dropping of tickets
    io.on('connection', (socket) => {

        socket.on('close_ticket', (msg) => {
    
            con.query("SELECT number_of_drops from ticket where ticket_id = ?", [msg.id], function (err, result, fields){
                if (err) throw err;
                no_of_drops = result[0].number_of_drops;
                new_no_drops = parseInt(no_of_drops)+1;

                if(new_no_drops == 5){
                    con.query(`UPDATE ticket
                    SET status = 'unsolvable', number_of_drops = ? WHERE ticket_id = ?`,[new_no_drops, parseInt(msg.id)], function (err, result, fields){
                    if (err) throw err;

                    con.query(`INSERT into dropped (reason, drop_date, drop_time, ticket_id, handler_id)
                    values(?, ?, ?, ?, ?)`, [msg.reason, msg.current_date, msg.current_dateTime, parseInt(msg.id), parseInt(session_id)], function (err, result, fields){
        
                        if (err) throw err;
                    });
                })
                }
                else{

                    con.query(`UPDATE ticket
                    SET status = 'dropped', number_of_drops = ? WHERE ticket_id = ?`,[new_no_drops, parseInt(msg.id)], function (err, result, fields){
                    if (err) throw err;

                    con.query(`INSERT into dropped (reason, drop_date, drop_time, ticket_id, handler_id)
                    values(?, ?, ?, ?, ?)`, [msg.reason, msg.current_date, msg.current_dateTime, parseInt(msg.id), parseInt(session_id)], function (err, result, fields){
        
                        if (err) throw err;
                    });
                })
                }
        });
        })
})


io.on('connection', (socket) => {
    socket.on('ticket_update_history', (msg) => {

            for (let i = 0; i < msg.changed_names.length; i++) {
                con.query(`INSERT into history_log (ticket_id, user_id, edited_item, new_value, date_time)
                            values(?, ?, ?, ?, ?)`, [msg.id, parseInt(session_id), msg.changed_names[i], msg.changed_values[i], msg.current_dateTime], function (err, result, fields){
                
                                if (err) throw err;
                            });
                        }    
    })

});


} else {
    res.redirect('/login.html');
}
});

/* GET Operation for External Specialist page */
app.get('/external.html', (req, res) => {

    /* Validation to check whether the logged in user is an external specialst */
    if (req.session.loggedin && session_job == "External Specialist") {

        con.query(`SELECT COUNT(ticket_id) FROM ticket WHERE ticket.handler_id = ? and (status != "dropped" AND status != "closed" AND status != "unsolvable")`
        ,[session_id], function (err, result, fields) {
            if (err) throw err;
    
            session_tickets = (JSON.stringify(result)).substring(21, 22);
        });
       
        /* Displaying all ticket details on external spec dashboard */
        con.query(`SELECT ticket_id, status, problem_type.name, last_updated, priority  FROM ticket 
        INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
        WHERE ticket.handler_id = ? and (status != "dropped" AND status != "closed" AND status != "unsolvable")
        ORDER BY CASE WHEN status = 'submitted' THEN 1
                WHEN status = 'unsuccessful' THEN 2
                WHEN status = 'active' THEN 3
                ELSE 4 END`,
        [session_id], function (err, result, fields) {
            if (err) throw err;

            query = result
            res.render('external', {
                newdropdownVals: query,
                loggeduser: session_username
            })

        });
        io.on('connection', (socket) => {
            socket.on("message", (msg) => {

                /* Fetching particular ticket details for active and unsuccessful statuses */
                if(msg.status == "active" || msg.status == "unsuccessful"){
                    con.query(`SELECT ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN  software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket_id = ?;`, [parseInt(msg.id)], function (err, result, fields) {
                        if (err) throw err;
    
                        io.send('message', result);
    
                    });
                }

                /* Fetching particular ticket details for submitted status tickets */
                else if(msg.status == "submitted"){

                    con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler,
                    solution.solution_description from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                    INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                    INNER JOIN software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket.ticket_id = ? AND ticket_solution.solution_status = "pending";`,[parseInt(msg.id)],function(err, result, fields) {
                    if (err) throw err;

                    io.send('message', result);

                    });
                }
                else{
                    ;
                }
            })
        })

        io.on('connection',  (socket) => {
    
            /* Socket operations for updating external specialist tickets */
            socket.on("update_message", (msg) => {
    
                con.query(`UPDATE ticket 
                    SET problem_description = ?, notes = ?, last_updated =?
                    WHERE ticket_id = ?`, [msg.problem_description, msg.notes, msg.last_updated ,parseInt(msg.id)], function (err, result, fields) {
           
                    if (err) throw err;
                });   
            });
            });

            io.on('connection', (socket) => {                
        
                /* Socket operations for conducting dropping of ticket [updating ticket and updating dropped table in db] */
                socket.on('drop_ticket', (msg) => {

                    con.query("SELECT number_of_drops from ticket where ticket_id = ?", [msg.id], function (err, result, fields){
                        if (err) throw err;
                        no_of_drops = result[0].number_of_drops;
                        new_no_drops = parseInt(no_of_drops)+1;

                        /* Changing of ticket status to unsolvable when no of drops = 5 */
                        if(new_no_drops == 5){
                            con.query(`UPDATE ticket
                            SET status = 'unsolvable', number_of_drops = ? WHERE ticket_id = ?`,[new_no_drops, parseInt(msg.id)], function (err, result, fields){
                            if (err) throw err;
        
                            con.query(`INSERT into dropped (reason, drop_date, drop_time, ticket_id, handler_id)
                            values(?, ?, ?, ?, ?)`, [msg.reason, msg.current_date, msg.current_dateTime, parseInt(msg.id), parseInt(session_id)], function (err, result, fields){
                
                                if (err) throw err;
                            });
                        })
                        }
                        else{

                            con.query(`UPDATE ticket
                            SET status = 'dropped', number_of_drops = ? WHERE ticket_id = ?`,[new_no_drops, parseInt(msg.id)], function (err, result, fields){
                            if (err) throw err;
        
                            con.query(`INSERT into dropped (reason, drop_date, drop_time, ticket_id, handler_id)
                            values(?, ?, ?, ?, ?)`, [msg.reason, msg.current_date, msg.current_dateTime, parseInt(msg.id), parseInt(session_id)], function (err, result, fields){
                
                                if (err) throw err;
                            });
                        })
                        }

                        
                    });
                })
        
        })

        io.on('connection', (socket) => {
            
            /* Socket operations for updating history log when ticket is dropped */
            socket.on('update_history', (msg) => {
                    con.query(`INSERT into history_log (ticket_id, user_id, edited_item, new_value, date_time)
                                values(?, ?, ?, ?, ?)`, [msg.id, parseInt(session_id), msg.changed_names, msg.changed_values, msg.current_dateTime], function (err, result, fields){
                        if (err) throw err;
                    });
            })
        });

        io.on('connection', (socket) => {
        
            /* Socket operations for updating ticket details in history log */
            socket.on('ticket_update_history', (msg) => {
                    for (let i = 0; i < msg.changed_names.length; i++) {
                        con.query(`INSERT into history_log (ticket_id, user_id, edited_item, new_value, date_time)
                                    values(?, ?, ?, ?, ?)`, [msg.id, parseInt(session_id), msg.changed_names[i], msg.changed_values[i], msg.current_dateTime], function (err, result, fields){
                                        if (err) throw err;
                        });
                    }  
            })
        });

            io.on('connection', (socket) => {
        
                /* Socket operations for handling submission of solutions */
                socket.on("Submit-Ticket", (msg) => {
                    con.query(`SELECT * from ticket_solution WHERE solution_status = 'pending' and ticket_id = ?`,[msg.id] ,function (err, result, fields) {
                        if (err) throw err;
                    
                        solution_id = result[0].solution_id;
                        if(result.length == 1){

                            con.query(`UPDATE solution SET solution_description = ? WHERE solution_id = ?`, [msg.solution, parseInt(solution_id)], function (err, result, fields) {
                                if (err) throw err;                                
                            });

                        }else{
                            con.query(`INSERT INTO solution (solution_description)
                            values(?)`,[msg.solution], function (err, result, fields) {
                            if (err) throw err;
                    
                        
                        con.query(`UPDATE ticket
                        SET status = 'submitted'
                        WHERE ticket_id = ?`,[msg.id], function (err, result, fields) {
                            if (err) throw err;
                
                            con.query(`SELECT * from solution where solution_description = ?`, [msg.solution], function (err, result, fields) {
                                if (err) throw err;

                                solution_id = result[0].solution_id;

                                con.query(`SELECT * from external_specialist where name = ?`, [msg.h_name], function (err, result, fields) {
                                    if (err) throw err;
                                    ext_spec_id = result[0].external_specialist_id
                                
                                    
                                con.query(`INSERT INTO ticket_solution
                                VALUES(?, ?, ?, ?)`, [msg.id, 'pending', ext_spec_id], function (err, result, fields) {
                                    if (err) throw err;
                        
                                    
                                });
                            });                                
                            });
                        });
                    });
                        }
                    }); 
                })
        })
} else {
    res.redirect('/login.html');
}});

app.all('/auth', urlencodedParser, (req, res) =>{
       /*
    * This function performs the bulk of the login authorisation. The form contained
    * in the login.ejs page redirects here, which then decrypts and validates the 
    * user's password before creating a session and redirecting the user to their
    * respective dashboard.
    * 
    * urlEncodedParser is passed to allow page inputs to be read.
     */
       let user_in = req.body.username;
       let pass_in = req.body.password; // pulls user and pass inputs from ejs page
       if (user_in && pass_in) {
           // SQL query below gets user data and decrypts inupt password simultaneously
           con.query('SELECT * FROM users WHERE username = ? AND AES_DECRYPT(password, SHA2(?, 256)) = ?', [user_in, user_in, pass_in], function(error, results, fields) {
               if (error) throw error;
               if (results.length > 0) {
                   // If user data found, session variables are initialised and the user's session is saved
                   req.session.loggedin = true;
                   req.session.username = user_in;
                   session_username = user_in;
                   req.session.save();
   
                   // Determines redirect based on user id
                   con.query('SELECT user_id FROM users WHERE username = ?', [user_in], function(error, results, fields) {
                       if (error) throw error;
   
                       if (results.length > 0) {
                           req.session.user_id = results[0].user_id;
                           req.session.save(); // Updates session with user id
                           session_id = req.session.user_id;
                           id_val = results[0].user_id;
                           if (id_val < 2000) {
                               session_job = "External Specialist";
                               return res.redirect('/external.html');
                           } else {
                               // Distinguishes between remaining user types using SQL query
                               con.query('SELECT job FROM employee WHERE employee_id = ?', [id_val], 
                               function(error, results, fields) {
                                   if (error) throw error;
                                   user_job = results[0].job;
                                    if (user_job == "Specialist") {
                                        session_job = user_job;
                                        return res.redirect('/intspecialist.html');
                                    } else if (user_job == "Analyst") {
                                        session_job = user_job;
                                        return res.redirect('/analyst.html');
                                    } else {
                                        session_job = "Employee";
                                        return res.redirect('/index.html');
                                    }
   
                       }) 
                           }
   
   
               } else {
                   res.send('Incorrect Username and/or Password!');
                   res.end();
               }			
             
               });
       } else {
           error = "Incorrect username/password. Please try again."
           res.render('login', {err: error}); // presence of err variable needed to display error message on client side
           res.end();
       }
       });
   }});

app.get('/logout', (req, res) =>{
    /*
    * This function destroys the user's session when called and redirects them to the login page.
     */
    if (req.session.loggedin) {
        req.session.destroy(err => {
          if (err) {
            res.status(400).send('Unable to log out')
          } else {
            res.redirect('/login.html')
          }
        });
} else {
     res.redirect('/login.html');
}});

app.get('/account.html', (req, res) =>{
     /*
    * This function builds the correct account page for the user and displays all relevant information.
    * It differentiated on user type based on user ID (external specialists have different IDs) and
    * thus different data to be displayed.
     */
     // res.sendFile(path.join(__dirname +  '/account.html'));
     const con = require('./public/scripts/dbconfig');
     if (req.session.loggedin) {
                 id_val = session_id;
     
                 if (id_val > 2000 && id_val < 3000) {
                     con.query('SELECT name, job, department, telephone FROM employee WHERE employee_id = ?', [id_val], 
                     function(error, results, fields) {
                         if (error) throw error;
                         // The below function sends variables to the account.ejs page to populate it
                         res.render('account', {
                             u_name: results[0].name,
                             u_job: results[0].job,
                             u_dept: results[0].department,
                             u_phone: results[0].telephone,
                             u_tickets: session_tickets
                         })   
 
                     })
                  } else {
                     con.query('SELECT name FROM external_specialist WHERE external_specialist_id = ?', [id_val], 
                     function(error, results, fields) {
                         if (error) throw error;
                         
                         res.render('account', {
                             u_name: results[0].name,
                             u_job: "External Specialist",
                             u_dept: "",
                             u_phone: "",
                             u_tickets: session_tickets
                         })   
 
                  });
                 
                 }
             } else {
                 res.redirect('/login.html');
     }});

/* GET Operation for Employee Home Page */
app.get('/index.html', (req, res) => {  
    /* Error checking if user who has logged in is an employee */
    if (req.session.loggedin && session_job == "Employee") {
   
        /* Displaying employees their created summarised created tickets */
        con.query(`SELECT ticket_id, status, last_updated, problem_type.name, priority, h.name  FROM ticket 
        INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
        INNER JOIN employee ON ticket.employee_id = employee.employee_id
        INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
        WHERE ticket.employee_id = ?
        ORDER BY CASE WHEN status = 'dropped' THEN 1
                    WHEN status = 'submitted' THEN 2
                    WHEN status = 'unsuccessful' THEN 3
                    WHEN status = 'active' THEN 4
                    ELSE 5 END`, 
        [session_id],function (err, result, fields) {
            if (err) throw err;
            query_output = result;
        });


        con.query(`SELECT COUNT(ticket_id) FROM ticket WHERE ticket.employee_id = ? and (status != "dropped" AND status != "closed" AND status != "unsolvable")`,[session_id],
            function (err, result, fields) {
                if (err) throw err;
        
                session_tickets = (JSON.stringify(result)).substring(21, 22);
            });

        /* Getting all hardware id's for datalist */
        con.query(`SELECT hardware_id from hardware;`, function (err, result, fields) {
            if (err) throw err;
            hardware_id = result;
        });

        /* Getting all operating systems for datalist */
        con.query(`SELECT name from operating_system;`, function (err, result, fields) {
            if (err) throw err;
            operating_system = result;
        });

        /* Getting all software names for datalist */
        con.query(`SELECT name from software;`, function (err, result, fields) {
            if (err) throw err;
            software_datalist = result;
        });

        /* Getting all problem types for datalist */
        con.query(`SELECT name from problem_type;`, function (err, result, fields) {
            if (err) throw err;
            prob_type_vals = result;
        });

        /* Getting all handler names for datalist */
        con.query(`SELECT employee.name, count(ticket_id) as "tickets" from ticket INNER JOIN handler ON ticket.handler_id = handler.user_id
        INNER JOIN employee ON handler.user_id = employee.employee_id
        WHERE ticket.status != 'closed'
        GROUP BY handler_id
        UNION
        SELECT external_specialist.name, count(ticket_id) from ticket INNER JOIN handler on ticket.handler_id = handler.user_id
        INNER JOIN external_specialist on external_specialist_id = handler.user_id
        WHERE ticket.status != 'closed'
        GROUP BY ticket.handler_id;`, function (err, result, fields) {
            if (err) throw err;
            handlers = result;
        });
    
        // Query to display tickets
        con.query(`SELECT ticket_id, status, problem_type.name  FROM ticket 
        INNER JOIN problem_type ON ticket.problem_type_id = problem_type.problem_type_id 
        WHERE ticket.employee_id = ?
        ORDER BY CASE WHEN status = 'dropped' THEN 1
                    WHEN status = 'submitted' THEN 2
                    WHEN status = 'pending' THEN 3
                    WHEN status = 'active' THEN 4
                    ELSE 5 END`, 
        [session_id],function (err, result, fields) {
            if (err) throw err;
            query = result
            res.render('index', {
                dropdownVals: query_output,
                newdropdownVals: query,
                loggeduser: session_username,
                hardwareids: hardware_id,
                operating_sys: operating_system,
                software_vals: software_datalist,
                probtype_vals: prob_type_vals,
                handler_vals: handlers   
            })
        });
        
        io.on('connection',  (socket) => {
            socket.on("message", (msg) => {
                /* Socket operations to get ticket details for closed status */
                if(msg.status == 'closed'){
                    con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, closing_time, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler, ticket_solution.solution_status,
                    solution.solution_description from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                    INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                    INNER JOIN  software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                    if (err) throw err;
                    io.send('message', result);
                    socket.disconnect(0);

                    });
                }
                /* Socket operations to get ticket details for unsolvable status */
                else if(msg.status == 'unsolvable'){
                    con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN  software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                    if (err) throw err;
                    io.send('message', result);
                    socket.disconnect(0);

                    });
                }

                /* Socket operations to get ticket details for active or dropped statuses */
                else if(msg.status == 'active' || msg.status == 'dropped'){

                    con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler
                    from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN  software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                    if (err) throw err;
                    io.send('message', result);
                    socket.disconnect(0);

                    });

                }

                /* Socket operations to get ticket details for submitted or unsuccessful statuses */
                else if(msg.status == 'submitted' || msg.status == 'unsuccessful'){

                    con.query(`SELECT ticket.ticket_id, status, priority, operating_system, problem_description, notes, software.name as software, solution.solution_description, ticket.hardware_id, hardware.manufacturer, hardware.make, hardware.model, problem_type.name,  h.name as Handler
                    from ticket
                    INNER JOIN hardware ON ticket.hardware_id = hardware.hardware_id
                    INNER JOIN ticket_solution on ticket.ticket_id = ticket_solution.ticket_id 
                    INNER JOIN solution ON ticket_solution.solution_id = solution.solution_id
                    INNER JOIN software on ticket.software_id = software.software_id 
                    INNER JOIN problem_type on ticket.problem_type_id = problem_type.problem_type_id
                    INNER JOIN (SELECT user_id, employee.name FROM handler
                    INNER JOIN employee ON handler.user_id = employee.employee_id
                    UNION
                    SELECT external_specialist_id AS user_id, name FROM external_specialist) h ON ticket.handler_id = h.user_id
                    WHERE ticket.ticket_id = ?;`,[parseInt(msg.id)],function(err, result, fields) {
                    if (err) throw err;
                    io.send('message', result);
                    socket.disconnect(0);

                    });
                }
                    })
            })

        io.on('connection',  (socket) => {

            /* Socket operations to update ticket when employee changes */
            socket.on("update_message", (msg) => {
                con.query(`SELECT problem_type_id from problem_type where name = ?;`,[msg.problem_type],function (err, result, fields) {
                    if (err) throw err;
                    problem_type_id = result[0].problem_type_id;

                    con.query(`SELECT software_id from software where name = ?;`,[msg.software],function (err, result, fields) {
                    if (err) throw err;
                    software_id = result[0].software_id;
            
                con.query(`SELECT user_id from handler INNER JOIN employee ON employee.employee_id  = handler.user_id WHERE employee.name = ?
                        UNION
                        SELECT external_specialist_id AS user_id FROM external_specialist WHERE name = ?`,[msg.handler_name,msg.handler_name],function (err, result, fields) {
                    if (err) throw err;
                    handler_id = result[0].user_id;

                con.query(`UPDATE ticket 
                    SET priority = ?, operating_system = ?, problem_description = ?, notes = ?, hardware_id = ?, software_id = ?, problem_type_id = ?, last_updated =?,  handler_id = ? 
                    WHERE ticket_id = ?`, [msg.priority, msg.os, msg.problem_description, msg.notes, parseInt(msg.hardware_id), software_id, problem_type_id, msg.last_updated ,handler_id ,parseInt(msg.id)], function (err, result, fields) {
                    
                    if (err) throw err;
                    socket.disconnect(0);
                });   
                });
            });
        });
            });
            })

            io.on('connection', (socket) => {
                socket.on("dropped_update", (msg) => {
                    //hstory log and also unsolvable status
                    con.query(`UPDATE ticket SET status = "active" where ticket_id = ?`, [msg], function (err, result, fields) {
            
                    if (err) throw err;
                    socket.disconnect(0);
        
                });   
                });
            });

            io.on('connection',  (socket) => {
                /* Socket operations to conduct status change for closing of tickets and changing to submitted status */
                socket.on("close_ticket", (msg) => {
                    ticket_status = msg.new_status

                        con.query(`UPDATE ticket
                        SET status = ?, closing_date = ?, closing_time = ? where ticket_id = ?;`,[msg.new_status, msg.date, msg.time, parseInt(msg.id)],function(err, result, fields) {
            
                        if (err) throw err;
                        
                        if(ticket_status == 'closed'){
                            con.query(`UPDATE ticket_solution
                            SET solution_status = 'successful' where ticket_id = ? and solution_status = 'pending';`,[parseInt(msg.id)],function(err, result, fields) {
                            if (err) throw err;
                            });
                        }
                        else if(ticket_status == 'submitted'){
                            con.query(`UPDATE ticket_solution
                            SET solution_status = 'unsuccessful' where ticket_id = ? and solution_status = 'pending';`,[parseInt(msg.id)],function(err, result, fields) {
                            if (err) throw err;
                            });
                        }
                    });  
                });
                })

                io.on('connection',  (socket) => {
            
                    /* Socket operations to update history log */
                    socket.on("ticket_update_history", (msg) => {
                    
                        con.query(`SELECT user_id from users where username = ?`,[msg.current_handler_uname],function (err, result, fields) {
                        if (err) throw err;
                        handler_id = result[0].user_id;
                        
                        for (let i = 0; i < msg.changed_names.length; i++) {
                            con.query(`INSERT INTO history_log(ticket_id, user_id, edited_item, new_value, date_time)
                            VALUES(?, ?, ?, ?, ?);`,[parseInt(msg.id), handler_id, msg.changed_names[i], msg.changed_values[i], msg.current_dateTime],function(err, result, fields) {
                                if (err) throw err;
                            });           
                        }
                    });
                    }); 
                    })

                io.on('connection',  (socket) => {
                    /* Socket operations to display history log for a particular ticket */
                    socket.on("display_history", (msg) => {
                    
                        con.query(`SELECT h.name, h.user_id, edited_item, new_value, date_time FROM history_log
                        INNER JOIN (SELECT user_id, employee.name FROM users
                        INNER JOIN employee ON users.user_id = employee.employee_id
                        UNION
                        SELECT external_specialist_id AS user_id, name FROM external_specialist) h 
                        ON history_log.user_id = h.user_id
                        WHERE ticket_id = ?`,[msg.ticketId],function (err, result, fields) {
                        if (err) throw err;
                        socket.emit('display_history', result)
                    
                    });

                    });
                })
        
} else {
    res.redirect('/login.html');
}});

server.listen(5005, () => {
    console.log('listening for requests on port 5005');
});
