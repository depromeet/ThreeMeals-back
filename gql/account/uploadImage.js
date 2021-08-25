const { createReadStream } = require('fs');
const { gql } = require('graphql-request');

const uploadImage = (client, variables) => {
    const data = {
        path: `${__dirname}/sample_image.jpg`,
    };

    const query = gql`
        mutation updateImage($file: Upload!) {
            updateImage(file: $file)
        }
    `

    const image = (variables && variables.path) ?
        createReadStream(variables.path) :
        createReadStream(data.path);

    client.request(query, { file: image })
        .then(result => console.log(JSON.stringify(result, null,2)))
        .catch(err => console.log(err));
};

module.exports = {
    uploadImage,
};
