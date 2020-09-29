//temperature = document.getElementById('temper');
//temp_float = parseFloat(temperature.innerHTML);
//
//if(temp_float <= 15) {
//    temperature.style.color = 'skyblue';
//} else if(15 < temp_float <= 25) {
//    temperature.style.color = 'gold';
//} else {
//    temperature.style.color = 'tomato';
//}

function sendReq (city) {
    $.ajax({
        url:'/get_weather',
        type: 'POST',
        data: city,
        success: function(data, textStatus, jqXHR) {
            alert('Good');
        }
    });
}
