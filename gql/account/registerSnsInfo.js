const { gql } = require('graphql-request');

const registerSnsInfo = (client, variables) => {
    const data = {
        snsType: "Instagram",
        snsId: "kyungseok_cory",
        url: "https://www.instagram.com/kyungseok_cory/",
    };

    const query = gql`
        mutation registerSnsInfo(
            $snsType: String!
            $snsId: String!
            $url: String!
        ) {
            registerSnsInfo(
                snsType: $snsType
                snsId: $snsId
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
