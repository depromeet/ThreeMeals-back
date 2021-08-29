const { gql } = require('graphql-request');

const getMyAccountInfo = (client, variables) => {
    const data = {

    };

    const GET_MY_PROFILE = gql`
        query {
            getMyAccountInfo {
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
    `

    client.request(GET_MY_PROFILE, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    getMyAccountInfo,
};
