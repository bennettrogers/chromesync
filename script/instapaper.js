// forked from https://github.com/edgarjs/instachrome
var Instapaper = {};

// Instapaper.Api
Instapaper.Api = new function () {

    var consumerKey = 'e33CkBo9RGTwL8iGuAwrupyaE8ttsEiHZukSvfAuL83kfVZd8m';
    var consumerSecret = 'ldosFWjvhTlYb1U8Z81I2LAU5QotW5SY1sIJJ3mM8oyPx83vLk';

    var addBookmark = function(id, bookmark) {
        var method = '/bookmarks/add';
        var params = {
            url: testPage
        };
        makeRequest(method, params, function() {
        });
    }

    var makeRequest = function(method, params, async, onSuccess) {
        var apiBase = 'http://www.instapaper.com/api/1';

        var url = apiBase + method,
            accessor = {
                consumerKey: consumerKey,
                consumerSecret: consumerSecret,
                token: localStorage['accessToken'],
                tokenSecret: localStorage['accessTokenSecret']
            },
            message = {
                action: url,
                method: 'POST',
                parameters: $.extend({}, params)
            };
        OAuth.completeRequest(message, accessor);

        $.ajax({
            async: async,
            type: 'POST',
            url: url,
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', OAuth.getAuthorizationHeader(url, message.parameters));
            },
            data: OAuth.getParameterMap(message.parameters),
            success: onSuccess,
            error: function(xhr, errorMessage, errorType) {
                //TODO: handle errors
            }
        });
    }

    var getUserInfo = function (username, password, onSuccess) {
        var userInfo = null;
        $.ajax({
            url: 'https://www.instapaper.com/api/1/account/verify_credentials', 
            data: {
                username: username,
                password: password
            },
            success: onSuccess
        });
    };

    var getAccessToken = function (username, password) {
        var onUserInfoFetched = function(data) {
            var userInfo = data[0];
            if(userInfo.type != 'user') {
                alert(userInfo.message);
            }

            var params = {
                x_auth_username: username,
                x_auth_password: password,
                x_auth_mode: 'client_auth'
            };

            makeRequest('/oauth/access_token', params, true, function(data) {
                accessToken = {};
                var response = data.split('&');
                for(var i=0; i<response.length; i++) {
                    var param = response[i].split('=');
                    accessToken[param[0]] = param[1];
                }
                accessToken.user_id = userInfo.user_id;
                accessToken.username = userInfo.username;
                accessToken.subscription_is_active = userInfo.subscription_is_active == '1';
                localStorage['accessToken'] = accessToken['oauth_token'];
                localStorage['accessTokenSecret'] = accessToken['oauth_token_secret'];
            });
        }

        getUserInfo(username, password, onUserInfoFetched);
    };

    return {
        getAccessToken: getAccessToken,
        addBookmark: addBookmark
    };
};
