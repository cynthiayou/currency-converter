
$(document).ready(function(){
    $('#my-form').on('submit', function(e){
        e.preventDefault();
        let socket = io();
        const fromAmount = $('#fromAmount').val();
        const fromCurrency = $('#fromCurrency').val();
        const toCurrency = $('#toCurrency').val();
        console.log(fromAmount + ' ' + fromCurrency + ' ' + toCurrency);
        socket.emit('task', {
            fromAmount: fromAmount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency
        });
        console.log("emitted");
        socket.on('result', function(data){
            $("#toAmount").val(data.amount);
            $("#output").html("<p>" + data.message + "</p>");
        })
    });

});



    //     e.preventDefault();
    //     console.log("submitted");
// jQuery('#form').on('submit', function(e){
//     e.preventDefault();
//     console.log("submitted");

//     // let messageTextbox = jQuery('[name=message]');

//     // socket.emit('createMessage', {
//     //     from: 'User',
//     //     text: messageTextbox.val()
//     // }, function() {
//     //     messageTextbox.val('')
//     // });
// });