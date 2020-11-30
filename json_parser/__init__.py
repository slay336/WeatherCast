import requests
import os
from enum import Enum
import datetime as dt


class Metrics(Enum):
    METRIC = "units=metric"
    IMPERIAL = "units=imperial"


class RequestType(Enum):
    WEATHER = "weather"
    DAILY = 'forecast/daily'


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/"):
        self.url = url

    def ask_weather_data(self, city: str, request_type: RequestType = RequestType.WEATHER,
                         metrics: Metrics = Metrics.METRIC):
        key = os.environ.get('WEATHER_KEY')
        if not key:
            raise ValueError("The weather key was not found")
        target_url = f"{self.url}{request_type.value}?q={city}"
        # Todo: сделать парсинг координат из файла-источника с городами и переписать daily/forecast на onecall
        if request_type.value == RequestType.WEATHER.value:
            target_url += f"&{metrics.value}"
        elif request_type.value == RequestType.DAILY.value:
            target_url += f"&cnt=6"
        target_url += f"&appid={key}"
        response = requests.get(target_url).json()
        if response.get('cod', 400) != 200:
            raise ValueError("The requested data was not received")
        return response

    def get_weather(self, city: str, metrics: Metrics = Metrics.METRIC) -> dict:

        response = self.ask_weather_data(city, RequestType.WEATHER)
        current_date_utc = dt.datetime.utcnow()
        current_date = current_date_utc + dt.timedelta(seconds=response["timezone"])

        icon = response["weather"][0]["icon"].replace('n', 'd')

        result = {
            "currentDate": dt.datetime.strftime(current_date, "%A, %b %d"),
            "currentTime": dt.datetime.strftime(current_date, "%H:%M"),
            "currentTemperature": f'{int(round(response["main"]["temp"], 0))}\xb0C',
            "realFeel": f'Real Feel {int(round(response["main"]["feels_like"]))}\xb0C',
            "humidity": f'Humidity {response["main"]["humidity"]}%',
            "currentImage": icon
        }

        forecast = self.ask_weather_data(city, RequestType.DAILY)
        print(forecast)
        return result
