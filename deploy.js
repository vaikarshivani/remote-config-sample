const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json'); // Replace with the path to your service account key JSON file
const projectId = 'shivani-remote'; // Replace with your Firebase project ID

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`,
});

function getTemplate() {
  var config = admin.remoteConfig();
  config.getTemplate()
    .then(function (template) {
      console.log('ETag from server:', template.etag);
      var templateStr = JSON.stringify(template);

      // Read the local JSON file
      fs.readFile('local_config.json', 'utf8', function (err, data) {
        if (err) {
          console.error('Error reading local_config.json:', err.message);
          return;
        }

        try {
          // Merge local JSON with the downloaded template
          const localConfig = JSON.parse(data);
          if (typeof localConfig === 'object') {
            const mergedTemplate = Object.assign({}, template, localConfig);

            // Write the merged JSON back to config.json
            fs.writeFileSync('config.json', JSON.stringify(mergedTemplate, null, 2));
            console.log('Remote Config template updated and written to config.json');

           
           
          } 
        } catch (err) {
          console.error('Error parsing local JSON:', err.message);
        }
      });
    })
    .catch(function (err) {
      console.error('Unable to get template:', err.message);
    });
}



getTemplate();
