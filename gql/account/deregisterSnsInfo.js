const { gql } = require('graphql-request');

const deregisterSnsInfo = (client, variables) => {
    const data = {
        snsType: "Instagram",
    };

    const query = gql`
        mutation deregisterSnsInfo(
            $snsType: String!
        ) {
            deregisterSnsInfo(
                snsType: $snsType
            ) {
                message
            }
        }
    `

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    deregisterSnsInfo,
};
