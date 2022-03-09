const db = require("../database");

function find_result(studentFirstName, studentLastName, testId) {
    let sql = `SELECT * 
    FROM TestResults
    WHERE student_first_name = '${studentFirstName}' AND student_last_name = '${studentLastName}' AND test_id = ${testId};`

   return db.query(sql).then(res => res.rows);
}

function create(results) {

    // Ideally would include guard statements to screen data, e.g. avoid duplication as per brief.

    results.forEach(result => {
        try {
            let scanDateTime = result["scanned-on"];
            let firstName = result["first-name"];
            let lastName = result["last-name"];
            let studentNumber = result["student-number"];
            let testId = result["test-id"];
            let { available, obtained } = result["summary-marks"]; 
            let marksPercentage = (+obtained / +available * 100).toFixed(2);

            find_result(firstName, lastName, testId)
                .then(dbRes => {
                    if (dbRes.length > 0) {
                        let higherAvailMark = dbRes.marks_available >= available 
                            ? dbRes.marks_available 
                            : available;
                        let higherObtMark = dbRes.marks_obtained >= obtained 
                            ? dbRes.marks_obtained 
                            : obtained;
                    
                        let sql = `UPDATE Testresults 
                        SET marks_available = $1, 
                            marks_obtained = $2 
                        WHERE student_first_name = $3 AND student_last_name = $4 AND test_id = $5;`

                        let values = [higherObtMark, higherAvailMark, firstName, lastName, testId];

                        db.query(sql, values);
                    } else {
                        let sql = `INSERT INTO TestResults (scan_date, student_first_name, student_last_name, student_number, test_id, marks_available, marks_obtained, marks_percentage) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
    
                        let values = [scanDateTime, firstName, lastName, studentNumber, testId, available, obtained, marksPercentage];
    
                        db.query(sql, values);
                    }
                })
  
        } catch(e) {
            // Throw error here
        }
    });
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

    return db.query(sql).then(res => res.rows);
}

const Result = {
    create,
    find_aggregate_by_testId
}

module.exports = Result;