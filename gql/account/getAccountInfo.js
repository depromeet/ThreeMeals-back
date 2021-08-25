const { gql } = require('graphql-request');

const getAccountInfo = (client, variables) => {
    const data = {
        accountId: "1"
    };

    const query = gql`
        query getAccountInfo($accountId: String!) {
            getAccountInfo(accountId: $accountId) {
                id
                nickname
                status
                image
                content
                socials {
                    id
                    socialType
                }
            }
        }
    `;

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    getAccountInfo,
};
