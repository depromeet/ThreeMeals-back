const { gql } = require('graphql-request');

const getMyNewPostCount = (client, variables) => {
    const data = {
        postType: 'Ask'
    };

    const query = gql`
        query GetMyNewPostCount($postType: PostType!) {
            getMyNewPostCount(postType: $postType) {
                postCount {
                    count
                    postType
                }
            }
        }
    `

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    getMyNewPostCount,
};
