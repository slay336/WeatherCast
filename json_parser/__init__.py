import requests
import os
from enum import Enum
import datetime as dt


class Metrics(Enum):
    METRIC = "units=metric"
    IMPERIAL = "units=imperial"


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/weather"):
        self.url = url

    def get_weather(self, city: str, metrics: Metrics) -> dict:
        key = os.environ.get('WEATHER_KEY')
        if not key:
            raise ValueError("The weather key was not found")
        target_url = f"{self.url}?q={city}&appid={key}&{metrics.value}"
        response = requests.get(target_url).json()
        if response.get('cod', 400) != 200:
            raise ValueError("The requested data was not received")
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
        return result
