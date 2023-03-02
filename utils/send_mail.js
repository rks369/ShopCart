module.exports = function sendEmail(name,mailId,subject,msg,html,callback) {
  const secretKey = '70c9816ca75bc270ffdcea58bf6a44a0';
  const apiKey = 'e5f5f2b06c3314dde4bba8ab4bb69672';
  const Mailjet = require('node-mailjet');
  const mailjet = Mailjet.apiConnect(apiKey, secretKey)
  const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
      "Messages": [
        {
          "From": {
            "Email": "ritesh8519147@jmieti.edu.in",
            "Name": "Ritesh"
          },
          "To": [
            {
              "Email": mailId,
              "Name": name
            }
          ],
          "Subject": subject,
          "TextPart": msg,
          "HTMLPart": html,
          "CustomID": "AppGettingStartedTest"
        }
      ]
    })
  request
    .then((result) => {
      callback(null,result);
    })
    .catch((err) => {
      callback(err,null);
    })

}