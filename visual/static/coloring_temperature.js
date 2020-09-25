temperature = document.getElementById('temper');
temp_float = parseFloat(temperature.innerHTML);

if(temp_float <= 15) {
    temperature.style.color = 'blue';
} else if(15 < temp_float <= 25) {
    temperature.style.color = 'yellow';
} else {
    temperature.style.color = 'red';
}