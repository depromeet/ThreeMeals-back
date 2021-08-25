const { gql } = require('graphql-request');

const registerSnsInfo = (client, variables) => {
    const data = {
        snsType: "Instagram",
        url: "https://www.instagram.com/kyungseok_cory/",
    };

    const query = gql`
        mutation registerSnsInfo(
            $snsType: String!
            $url: String!
        ) {
            registerSnsInfo(
                snsType: $snsType
                url: $url
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
    registerSnsInfo,
};
