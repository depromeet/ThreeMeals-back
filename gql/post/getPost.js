const { gql } = require('graphql-request');

const getPost = (client, variables) => {
    const data = {
        postId: '1'
    };

    const query = gql`
        query getPost($postId: String!) {
            getPost(postId: $postId) {
                id
                content
                postType
                postState
                color
                secretType
                createdAt
                updatedAt
                commentsCount
                fromAccount {
                    id
                }
                toAccount {
                    id
                }
                # likedPosts {
                #   id
                #   createdAt
                # },
                usedEmoticons {
                    id
                    position {
                        positionX
                        positionY
                    }
                    fileUrl
                    name
                }
                comments {
                    id
                    content
                    secretType
                    commentState
                    createdAt
                    updatedAt
                }
                createdAt
                updatedAt
                commentsCount
            }
        }
    `

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    getPost,
};
