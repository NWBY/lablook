#!/usr/bin/env node

// Require modules
const axios = require('axios');
const builUrl = require('build-url');
const program = require('commander');
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const token = require('./lib/token');

// Path to .gitlab-token file
const pathToFile = os.homedir() + '/.gitlab-token.json';

// labview init command
program.command('init').description('Create your access file.').action(function () {
    token.createFile();
});

// Parse commander commands
program.parse(process.argv);



// Global variable that stores user's username and access token
let user_id;
let tokenValue;


// Check to see if file exists and if it does then extract data out of file
function checkFile() {
    if (fs.existsSync(pathToFile)) {
        let credentials = fs.readFileSync(pathToFile);
        let data = JSON.parse(credentials);
        tokenValue = data.accessToken;
        user_id = data.username;
    } else {
        console.log(chalk.bold.whiteBright("Oh! You need to create a .gitlab-token.json file. Run lablook init to create the file."));
    }
};

// Call check file function
checkFile();

// Build projects URL with user_id
let projectsUrl = builUrl('https://gitlab.com/api/v4/users', {
    path: user_id + '/projects'
});

// Config object for axios function
let config = {
    headers: {
        "Private-Token": tokenValue
    }
}

// Axios function call that gets all project names.
axios.get(projectsUrl, config).then(response => {
    console.log("");
    console.log(chalk.bold.whiteBright("-----------------------------------------------------------------------------------"));
    console.log(chalk.bold.green("Projects"));
    console.log(chalk.bold.whiteBright("-----------------------------------------------------------------------------------"));
    // Loops through the response and displays project names.
    let i = 0;
    while (i < response.data.length) {
        console.log(chalk.bold.whiteBright(response.data[i].name));
        i++;
    };
    console.log("");
}).catch((error) => {
    if (error instanceof TypeError) {
        return;
    } else if (error.response.status == 401) {
        console.log(chalk.bold.yellow("Your Gitlab username may be correct. But I think your access token is incorrect. Run labview init and enter your details again."));
    } else if (error.response.status == 404) {
        console.log(chalk.bold.yellow("Ah an error! Your Gitlab credentials may be incorrect. Run labview init and enter your details again."));
    } else {
        console.log(error);
    }
});