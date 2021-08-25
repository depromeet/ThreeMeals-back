const { gql } = require('graphql-request');

const updateAccountInfo = (client, variables) => {
    const data = {
        content: "안뇽하세요1@!@!@",
        nickname: "hehehehehe",
        instagramUrl: "asfejkbfke"
    };

    const query = gql`
        mutation updateAccountInfo(
            $content: String
            $nickname: String!
            $instagramUrl: String
        ) {
            updateAccountInfo(
                content: $content
                nickname: $nickname
                instagramUrl: $instagramUrl
            ) {
                id
                nickname
                status
                image
                content
                profileUrl
                snsInfos {
                    id
                    snsType
                    url
                }
            }
        }
    `

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    updateAccountInfo,
};
