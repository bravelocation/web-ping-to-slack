var request = require("request");
var IncomingWebhook = require('@slack/client').IncomingWebhook;

var WebPingToSlackService = function () {}

// Setup Slack
var url = process.env.SLACK_WEBHOOK_URL || '';
var webhook = new IncomingWebhook(url);

// Function which tries hitting the given url
WebPingToSlackService.checkWebsite = function (url, callback) {
    request(
        {
            uri: url,
            method: "GET",
            timeout: 30000,
            followRedirect: false,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
                }
        },
        function(error, response) {
            var success = false;
            var errorCode = 999;
    
            if (response) {
                errorCode = response.statusCode;

                if (error == null && response.statusCode == 200) {
                    success = true;
                }
            }

            console.log(url + ": " + success + " (" + errorCode + ")");
            callback(url, success, errorCode, error);
        });  
};

// Function that sends error message via Slack
WebPingToSlackService.sendErrorMessage = function(url, errorCode, error) {
    var message = "Site down: " + url + " (" + errorCode + "): " + error;
    webhook.send(message, function(err, res) {
        if (err) {
            console.log('Error:', err);
        } else {
            console.log('Message sent: ', res);
        }
    });
}

module.exports = WebPingToSlackService;