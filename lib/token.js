const readlineSync = require('readline-sync');
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');

const pathToFile = os.homedir() + '/.gitlab-token.json';

function createFile() {
    const user_id = readlineSync.question(chalk.bold.whiteBright("Please enter your Gitlab username: "));
    const userToken = readlineSync.question(chalk.bold.whiteBright("Please enter your Gitlab Access Token: "));
    var userObject = {
        username: user_id,
        accessToken: userToken
    };
    let newData = JSON.stringify(userObject, null, 2);
    fs.writeFileSync(pathToFile, newData);
};

module.exports.createFile = createFile;