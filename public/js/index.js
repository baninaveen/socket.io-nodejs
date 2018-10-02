var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a');
    // console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime} : ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geo Location not supported by your browser');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationBtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationBtn.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});