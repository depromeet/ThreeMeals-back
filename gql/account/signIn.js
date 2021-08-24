const { gql } = require('graphql-request');

const signIn = (client, variables) => {
    const data = {
        accessToken: "ZuyudwXHTMI9Z5OvUcGEmVMVSCE1A1FCtgdCdgo9cusAAAF67gjG7w",
        provider: "Kakao"
    };
    const query = gql`
        mutation signIn($accessToken: String!, $provider: String!) {
            signIn(accessToken: $accessToken, provider: $provider) {
                token
            }
        }
    `;

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    signIn,
};
