
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
        searchText: ""
    },
    methods: {
        sendSearchRequest: function() {
            if (this.searchText != "") {
                let lastSearchText = this.searchText;
                let promise = new Promise(function(resolve, reject){
                    // ждем полсекунды, потом запрашиваем подходящие города
                    setTimeout(() => resolve('done'), 500);
                });
                promise.then(function(result){
                    // запрашиваем подходящие города только если по истечении секунды текст поискового запроса не
                    // изменился
                    if (lastSearchText === app.searchText) {
                        axios
                            .get('/search_city?query=' + app.searchText)
                            .then(function(response){
                                app.searchResults.results = response.data.result.slice(0, 5);
                                app.searchResults.show = true;

                            });
                    }
                });
            } else {
                this.searchResults = {
                    results: [],
                    show: false
                }
            }
        },
        chooseSearchResult: function(event) {
            this.searchText = event.target.innerHTML.trim();
            this.searchResults.show = false;
            document.cookie = "currentCity=" + this.searchText;
            this.requestWeather();
        },
        requestWeather: function() {
            axios
                .get('/get_weather')
                .then(function(response) {
                    for (var key in response.data) {
                        app[key] = response.data[key];
                    }
                });
        },
        cityButtonSelect: function(event){
            function getOptionIndex(elementId) {
                if (elementId != undefined)
                {
                    return parseInt(elementId.replace(/option/gi, ''));
                } else
                {
                    return undefined;
                }

            }
            let selectedCities = document.getElementsByClassName('searchOption active');
            let currentCity = selectedCities.length > 0 ? selectedCities[0].id : undefined;
            let currentCityIndex = getOptionIndex(currentCity);

            for (let i = 0; i < selectedCities.length; i++)
            {
                selectedCities[i].classList.remove('active');
            }
            let shownCities = document.getElementById('searchOptions').children;
            // получим текущий выбранный элемент

            let newCityIndex = undefined;
            if ((event.key == "ArrowDown" || event.key == "ArrowUp") && shownCities.length > 0)
            {
                // нажали стрелочку, и есть предлагаемые варианты
                if (currentCityIndex != undefined)
                {
                    // что-то уже выбрали
                    if (event.key == "ArrowDown" && shownCities.length - 2 >= currentCityIndex)
                    {
                        // переходим на элемент ниже, но не ниже самого нижнего
                        newCityIndex = currentCityIndex + 1;
                    }
                    else if (event.key == "ArrowUp" && currentCityIndex > 0)
                    {
                        // переходим на элемент выше, но не выше самого верхнего элемента
                        newCityIndex = currentCityIndex - 1;
                    }
                }
                else
                {
                    // если ничего еще не выбрали, то по нажатии на любую стрелку встаем на верхний элемент
                    newCityIndex = 0;
                }
            }
            if (newCityIndex != undefined)
            {
                document.getElementById("option" + newCityIndex).classList.add('active');
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