# WeatherCast

### Описание
Одностраничный интерфейс, отображающий текущую погоду и прогноз на неделю и использующий ресурс https://openweathermap.org/

### Требования
1. Установленный Git (`sudo apt install git`)
2. Установленный [Docker](https://docs.docker.com/engine/install/ubuntu/)
3. Установленный [Docker-compose](https://docs.docker.com/compose/install/)

### Установка
1. `git clone git@github.com:slay336/WeatherCast.git`
2. В файле `.env` в переменную окружения `WEATHER_CAST` необходимо вписать ключ из личного кабинета https://openweathermap.org/
3. `docker-compose up`
