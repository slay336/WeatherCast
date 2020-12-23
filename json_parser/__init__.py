import requests
import os
from enum import Enum
import datetime as dt
import json

with open("city_names.json", "r") as f:
    available_cities = json.loads(f.read())


class Units(Enum):
    METRIC = "units=metric"
    IMPERIAL = "units=imperial"


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/"):
        self.url = url
        self.key = os.environ.get('WEATHER_KEY')
        if not self.key:
            raise ValueError("The weather key was not found")

    def ask_weather_data(self, city: str):
        city_data = available_cities[city]
        target_url = f"{self.url}onecall?lat={city_data['lat']}&lon={city_data['lon']}" \
                     f"&exclude=minutely,hourly,alerts&{Units.METRIC.value}&appid={self.key}"
        response = requests.get(target_url).json()
        return response

    @staticmethod
    def set_icon_to_day(icon: str):
        return icon.replace('n', 'd')

    def get_weather(self, city: str) -> dict:

        response = self.ask_weather_data(city)
        # current_date_utc = dt.datetime.utcnow()
        current_date = dt.datetime.utcnow() + dt.timedelta(seconds=response["timezone_offset"])
        current_weather = response["current"]

        result = {
            "currentDate": dt.datetime.strftime(current_date, "%A, %b %d"),
            "currentTime": dt.datetime.strftime(current_date, "%H:%M"),
            "currentTemperature": f'{int(round(current_weather["temp"], 0))}\xb0C',
            "realFeel": f'Real Feel {int(round(current_weather["feels_like"]))}\xb0C',
            "humidity": f'Humidity {current_weather["humidity"]}%',
            "currentImage": self.set_icon_to_day(current_weather["weather"][0]["icon"]),
            "forecasts": []
        }

        forecasts = response["daily"][1:7]
        for forecast in forecasts:
            result["forecasts"].append({
                "dayOfWeek": dt.datetime.strftime(dt.datetime.fromtimestamp(forecast["dt"]), '%a'),
                "temperature": f"{int(round(forecast['temp']['day'], 0))}\xb0C",
                "icon": self.set_icon_to_day(forecast["weather"][0]["icon"])
            })
        return result
