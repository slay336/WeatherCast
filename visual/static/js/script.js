
function getCookie(name) {
  // заимствовано из https://learn.javascript.ru/cookie
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

Vue.component('currentimage', {
    props: ['imagename'],
    template: '<img :src="\'static/img/\' + imagename + \'.png\'">'
});

var app = new Vue({
    el: '#page',
    data: {
        currentDate: 'no data yet',
        currentTemperature: '',
        currentTime: '',
        realFeel: '',
        humidity: '',
        currentImage: '01d',
        forecasts: [
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            },
            {
                dayOfWeek: "thu",
                temperature: "26 C",
                icon: '01d'
            }
        ],
        searchResults: {
            results: [],
            show: false
        },
        searchText: "",
        animationClass: "",
        citySearchTimeout: null
    },
    methods: {
        sendSearchRequest: function() {
            let promise = new Promise(function(resolve, reject){
                // ждем полсекунды, потом запрашиваем подходящие города
                clearTimeout(app.citySearchTimeout);
                app.citySearchTimeout = setTimeout(() => resolve('done'), 500);
            });
            promise.then(function(result){
                // запрашиваем подходящие города только если по истечении секунды текст поискового запроса не
                // изменился
                if (app.searchText != "") {
                    axios
                        .get('/search_city?query=' + app.searchText)
                        .then(function(response){
                            app.searchResults.results = response.data.result.slice(0, 5);
                            app.searchResults.show = true;
                        });
                } else {
                    clearTimeout(this.citySearchTimeout);
                    app.searchResults = {
                        results: [],
                        show: false
                    }
                }
            });
        },
        chooseSearchResult: function(event) {
            this.chooseSearchResultById(event.target.id);

        },
        chooseSearchResultById: function(id){
            this.searchText = document.getElementById(id).innerHTML.trim();
            this.searchResults.show = false;
            document.cookie = "currentCity=" + this.searchText;
            this.requestWeather();
        },
        requestWeather: function() {
            let mainWeatherIcon = document.getElementById("mainWeatherIcon");
            // для начала будем останавливать анимацию после завершения первого прогона
            mainWeatherIcon.addEventListener("animationiteration", function(event){
                mainWeatherIcon.style.animationPlayState = "paused";
                mainWeatherIcon.removeEventListener("animationiteration", null);
            });
            // включим анимацию сразу после выбора города
            this.animationClass = "animated";
            // запрашиваем погоду. анимация должна будет ждать получения результата
            axios
                .get('/get_weather')
                .then(function(response) {
                    // данные получены. каждые полсекунды проверяем, завершилась ли анимация
                    new Promise(function(resolve, reject){
                        setInterval(function(){
                            if (mainWeatherIcon.style.animationPlayState == "paused") {
                                resolve();
                            }
                        }, 500);
                    }).then(function(){
                        // анимация завершилась, данные получены. отображаем данные в нужных элементах
                        for (var key in response.data) {
                            app[key] = response.data[key];
                        }
                        // продолжаем анимацию
                        mainWeatherIcon.style.animationPlayState = "running";
                        // при завершении анимации, откатываемся к дефолтному состоянию
                        mainWeatherIcon.addEventListener("animationend", function(event){
                            app.animationClass = "";
                            mainWeatherIcon.removeEventListener("animationend", null);
                        });
                    });
                });
        },
        deactivateSelectedCity: function(){
            let selectedCities = document.getElementsByClassName('searchOption active');
            for (let i = 0; i < selectedCities.length; i++){
                selectedCities[i].classList.remove('active');
            }
        },
        cityButtonSelect: function(event){
            function getOptionIndex(elementId) {
                if (elementId != undefined) {
                    return parseInt(elementId.replace(/option/gi, ''));
                } else {
                    return undefined;
                }
            }
            event.preventDefault();
            let selectedCities = document.getElementsByClassName('searchOption active');
            // получим текущий выбранный элемент
            let currentCity = selectedCities.length > 0 ? selectedCities[0].id : undefined;
            let currentCityIndex = getOptionIndex(currentCity);

            let dropdown = document.getElementById('searchOptions')
            let shownCities;
            if (dropdown != null){
                shownCities = dropdown.children;
            } else {
                shownCities = [];
            }

            let newCityIndex = undefined;
            if (shownCities.length > 0){
                if ((event.key == "ArrowDown" || event.key == "ArrowUp")) {
                    // нажали стрелочку, и есть предлагаемые варианты
                    if (currentCityIndex != undefined) {
                        // что-то уже выбрали
                        if (event.key == "ArrowDown" && shownCities.length - 2 >= currentCityIndex) {
                            // переходим на элемент ниже, но не ниже самого нижнего
                            this.deactivateSelectedCity();
                            newCityIndex = currentCityIndex + 1;
                        }
                        else if (event.key == "ArrowUp" && currentCityIndex > 0) {
                            // переходим на элемент выше, но не выше самого верхнего элемента
                            this.deactivateSelectedCity();
                            newCityIndex = currentCityIndex - 1;
                        }
                    }
                    else {
                        // если ничего еще не выбрали, то по нажатии на любую стрелку встаем на верхний элемент
                        newCityIndex = 0;
                    }

                    if (newCityIndex != undefined){
                        document.getElementById("option" + newCityIndex).classList.add('active');
                    }
                } else if (event.key = "Enter") {
                    this.chooseSearchResultById(document.getElementById(currentCity).id);
                }
            }
        }
    }
});

window.onload = function() {
    currentCity = getCookie("currentCity");
    if (currentCity != undefined) {
        app.searchText = currentCity;
        app.requestWeather();
    }
};