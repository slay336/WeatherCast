import requests
import json
import os
from enum import Enum


class Metrics(Enum):
    METRIC = "units=metric"
    IMPERIAL = "units=imperial"


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/weather"):
        self.url = url

    def get_weather(self, city: str, metrics: Metrics) -> dict:
        key = os.environ.get('WEATHER_KEY')
        response = requests.get(f"{self.url}?q={city}&appid={key}&{metrics}").json()
        """ требуемые поля:
            timezone (сдвиг в секундах от utc)
            main.temp 
            main.feels_like
            main.humidity
            weather.icon
        """
        result = {
            "timezone": response["timezone"] / 3600,
            "current_temperature": int(round(response["main"]["temp"], 0)),
            "feels_like": int(round(response["main"]["feels_like"])),
            "humidity": response["main"]["humidity"],
            "icon": response["weather"][0]["icon"]
        }
        return result

    @staticmethod
    def get_available_cities():
        with open("cities_info.json", "r") as f:
            data = json.loads(f.read())
        cities = []
        for datum in data:
            cities.append(datum["name"])
        return cities


# if __name__ == "__main__":
#     weather = WeatherRetriever("http://api.openweathermap.org/data/2.5/weather")
#     print(weather.get_weather("Taglag"))
#     # WeatherRetriever.get_available_cities()
