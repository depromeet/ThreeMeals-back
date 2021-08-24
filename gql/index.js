const { GraphQLClient } = require('graphql-request');
const { signIn } = require("./account/signIn");
const { getAccountInfo } = require("./account/getAccountInfo");
const { getMyAccount } = require("./account/getMyAccount");
const { updateAccountInfo } = require("./account/updateAccountInfo");

const { getMyNewPostCount } = require("./post/getMyNewPostCount");
const { getPosts } = require("./post/getPosts");
const { getPost } = require("./post/getPost");
const { createPost } = require("./post/createPost");

const command = process.argv[2];
if (!command) {
    console.log("Please input commands")
}

let variables = undefined;
if (process.argv[3]) {
    variables = JSON.parse(process.argv[3]);
}

const endPoint = 'http://localhost:4000/graphql';
const client = new GraphQLClient(endPoint, {
    headers: {
        'account-id': '2',
    },
});

console.log(`---> start ${command}`);
switch (command) {
    case "signIn":
        signIn(client, variables);
        break;
    case "getAccountInfo":
        getAccountInfo(client, variables);
        break;
    case "getMyAccount":
        getMyAccount(client, variables);
        break;
    case "updateAccountInfo":
        updateAccountInfo(client, variables);
        break;
    case "getMyNewPostCount":
        getMyNewPostCount(client, variables);
        break;
    case "getPosts":
        getPosts(client, variables);
        break;
    case "getPost":
        getPost(client, variables);
        break;
    case "createPost":
        createPost(client, variables);
        break;
    default:
        console.log("Please input correct commands")
}
