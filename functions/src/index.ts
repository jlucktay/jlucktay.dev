import { https } from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const go_vcs_base = "https://github.com/jlucktay"

export const goPackage = https.onRequest((request, response) => {
  response.send(`<meta name=go-import content="${request.hostname}${request.path} git ${go_vcs_base}${request.path}">`)
});
