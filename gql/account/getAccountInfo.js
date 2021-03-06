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
                profileUrl
                snsInfos {
                    id
                    snsId
                    snsType
                    url
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
