var Options = function() {
    var initialize = function() {
        $('#Save').click(function() {
            save();
        });
    }

    var save = function() {
        var username = $('#username').val();
        var password = $('#password').val();
        Instapaper.Api.getAccessToken(username, password);
    }

    initialize();
}

$(function() {
    var o = new Options();
});
