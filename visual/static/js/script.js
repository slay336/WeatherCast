Vue.component('currentimage', {
    props: ['imagename'],
    template: '<img :src="\'static/img/\' + imagename + \'.png\'">'
})

var app = new Vue({
    el: '#page',
    data: {
        currentDate: 'Monday, may 23',
        currentTemperature: '27 C / 81F',
        currentTime: '14:35',
        realFeel: 'Real Feel 25 C / 76F',
        humidity: 'Humidity 61%',
        currentImage: '01d'
    }
})