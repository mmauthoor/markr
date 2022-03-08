const db = require("../database");

function create(results) {

    // need to ensure only quality data is provided to DB - add guard statements to ensure no duplication etc

    for (const prop in results) {
        try {
            // could destructure to clean this up
            let result = results[prop];
            let scanDateTime = result["scanned-on"];
            let firstName = result["first-name"];
            let lastName = result["last-name"];
            let studentNumber = result["student-number"];
            let testId = result["test-id"];
            let { available, obtained } = result["summary-marks"]; 
            let marksPercentage = (+obtained / +available * 100).toFixed(2);

            let sql = `INSERT INTO TestResults 
            (scan_date, student_first_name, student_last_name, student_number, test_id, marks_available, marks_obtained, marks_percentage) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`

            let values = [scanDateTime, firstName, lastName, studentNumber, testId, available, obtained, marksPercentage];

            db.query(sql, values);

        } catch(e) {
            console.log(`Error with result ${result[prop]}`);
        }
    }
}

function find_aggregate_by_testId(testId) {
    let sql = `SELECT 
        AVG(marks_percentage)::numeric(10,1) AS mean,
        STDDEV_POP(marks_percentage)::numeric(10,1) AS stddev,
        MIN(marks_percentage)::numeric(10,1),
        MAX(marks_percentage)::numeric(10,1),
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p25,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p50,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p75,
        COUNT(*)
    FROM TestResults 
    WHERE test_id = ${testId};`

    // SELECT 
    //     AVG(marks_percentage)::numeric(10,1) AS mean,
    //     STDDEV_POP(marks_percentage)::numeric(10,1) AS stddev,
    //     MIN(marks_percentage)::numeric(10,1),
    //     MAX(marks_percentage)::numeric(10,1),
    //     PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p25,
    //     PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p50,
    //     PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY TestResults.marks_percentage)::numeric(10,1) AS p75,
    //     COUNT(*)
    // FROM TestResults 
    // WHERE test_id = 9863;

    return db.query(sql).then(res => res.rows);
}

const Result = {
    create,
    find_aggregate_by_testId
}

module.exports = Result;