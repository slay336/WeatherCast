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

function getWe (city) {
    $.ajax({
        url: '/get_weather',
        method: 'POST',
        data: city,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            console.log('good')
            $("#temporary").remove();
            $('<div>', {
            'class': 'row justify-content-center',
            'id': 'temporary'
            }).appendTo(document.body);
            $('<label>', {
            text: data["temperature"]
            }).appendTo("#temporary");
            $('<img>', {
            'src': data["link"]
            }).appendTo("#temporary");
//            var div1 = document.createElement('div')
//            div1.innerHTML = data[city]
//            document.body.append(div1)
        }
    })
}
