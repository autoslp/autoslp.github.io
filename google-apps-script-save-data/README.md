# Google Apps Script Save Data

This project is a Google Apps Script application designed to save data to a Google Sheet named "Tonghop" when a form is submitted. It provides a simple interface for users to send data, which is then processed and stored in the specified Google Sheet.

## Project Structure

- **src/Code.gs**: Contains the main Google Apps Script code, including the `doGet` and `doPost` functions.
- **appsscript.json**: Configuration file for the Google Apps Script project, specifying project settings and required scopes.
- **README.md**: Documentation for the project.

## Functions

### doGet

The `doGet` function checks the connection to the script and returns a simple text response. This function can be used to verify that the script is deployed correctly.

### doPost

The `doPost` function receives data from a form submission. It parses the incoming data, constructs a row of data in the correct order, and appends it to the "Tonghop" Google Sheet. This function is essential for saving user input into the spreadsheet.

## How to Use

1. Deploy the Google Apps Script as a web app.
2. Ensure that the Google Sheet named "Tonghop" exists in your Google Drive.
3. Use the provided endpoint to send data via a POST request from your application or form.
4. The data will be appended to the "Tonghop" sheet automatically.

## Requirements

- Google account with access to Google Sheets.
- Basic understanding of Google Apps Script and web app deployment.

## License

This project is open-source and available for modification and distribution under the terms of your choice.