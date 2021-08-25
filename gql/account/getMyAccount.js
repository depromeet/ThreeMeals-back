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
                socials {
                    id
                    socialType
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
