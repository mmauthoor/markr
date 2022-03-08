const db = require("../database");


function create(results) {

    // need to ensure only quality data is provided to DB - add guard statements


    for (const prop in results) {
        try {
            let result = results[prop];
            let scanDateTime = result["scanned-on"];
            let firstName = result["first-name"];
            let lastName = result["last-name"];
            let studentNumber = result["student-number"];
            let testId = result["test-id"];
            let { available, obtained } = result["summary-marks"]; 
            let marksPercentage = +obtained / +available;

            let sql = `INSERT INTO TestResults (scan_date, student_first_name, student_last_name, student_number, test_id, marks_available, marks_obtained, marks_percentage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`

            let values = [scanDateTime, firstName, lastName, studentNumber, testId, available, obtained, marksPercentage];

            db.query(sql, values);

        } catch(e) {
            console.log(`Error with result ${result[prop]}`);
        }
    }
}

function results() {
    let sql = "SELECT * FROM TestResults;"
    return db.query(sql).then(res => res.rows);
}

const Result = {
    create,
    results
}

module.exports = Result;