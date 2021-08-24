const { gql } = require('graphql-request');

const createPost = (client, variables) => {
    const data = {
        content: "하하하하하",
        toAccountId: "1",
        color: "#121212",
        secretType: "Forever",
        postType: "Ask",
        emoticons: [
            {
                emoticonId: "1",
                position: {
                    positionX: 0,
                    positionY: 1
                }
            }
        ]
    };

    const query =  gql`
        mutation createPost(
            $content: String!
            $toAccountId: String!
            $color: String!
            $secretType: String!
            $postType: String!
            $emoticons: [emoticons!]!
        ) {
            createPost(
                content: $content
                toAccountId: $toAccountId
                color: $color
                secretType: $secretType
                postType: $postType
                emoticons: $emoticons
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
    createPost,
};
