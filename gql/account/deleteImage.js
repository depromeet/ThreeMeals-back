const { gql } = require('graphql-request');

const deleteImage = (client, variables) => {
    const query = gql`
        mutation updateImageToBasic {
            updateImageToBasic
        }
    `;

    client.request(query)
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    deleteImage,
};
