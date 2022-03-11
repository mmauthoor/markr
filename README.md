# Markr
Markr is an exam marking data ingestion microservice that receives and stores student exam results from XML via POST request and provides aggregate data for individual tests via GET requests. 
It is built using popular Node.js web app framework Express.js, and stores data in a PostgreSQL database. XML is parsed using [express-xml-bodyparser](https://github.com/remind101/express-xml-bodyparser).

## Approach
The main features of Markr are essentially two endpoints:
- a POST /import endpoint to receive XML data, screen out incorrect/'junk' data and save valuable data to persistent storage
- a GET endpoint /results/:test-id/aggregate that provides aggregate data for a particular test

A PostgreSQL database was selected for data storage because its structured nature suits the consistently structured incoming data (e.g. student number, test id and marks data), but also to take advantage of the relational database ability to perform the aggregate calculations relatively efficiently. Only the marks percentage value is calculated on the server side; it is then stored in the database table, and queried aggregate data is calculated in SQL before the response is provided in JSON format.  

## Assumptions
- It was assumed that in the case of duplicate student submissions with different results, the result with the higher obtained marks will always have the same or higher *available* marks than the other submission (never lower), thus the database will always be updated with the higher available marks value when faced with multiple submissions
- As per the brief, it was assumed that the aggregate fetching doesn't need to be fast in this prototype
- It was assumed that security is not currently a priority (e.g. considering the lack of SSL), therefore authentication and authorisation have not been implemented

## Areas of future work
- Although on a small scale the SQL calculation of aggregate values is quick due to the relative simplicity of the calculations, this may become less efficient on a larger scale, such as if several thousand student tests required aggregate data calculation
- Further consistency checks, such as to ensure full student name and student number are consistent across submissions throughout the database (if student numbers do not change from year to year), and potentially throw an error if a new submission is inconsistent with pre-existing student data

## Areas of note
Due to time and ability constraints, Markr is an incomplete prototype. The following features have not yet been added or implemented: 
- Acceptance only of XML files of content type text/xml+markr
- Safeguarding against the other kinds of XML documents the Markr grading machines produce
- Rejection of entire documents containing only partial test results via appropriate HTTP error
- Error handling and unit testing