const { gql } = require('graphql-request');

const getPosts = (client, variables) => {
    const data = {
        first: 0,
        accountId: '2'
    };

    const query = gql`
        query getPosts($first: Float!, $accountId: String!) {
            getPosts(first: $first, accountId: $accountId) {
                edges {
                    node {
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
                            nickname
                            image
                        }
                        toAccount {
                            id
                            nickname
                            image
                        }
                        likedPosts {
                            id
                            createdAt
                        }
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
                    cursor
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    `

    client.request(query, variables || data)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    getPosts,
};
