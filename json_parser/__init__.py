import requests
import json
import os


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/weather"):
        self.url = url

    def get_weather(self, city: str) -> dict:
        response = requests.get(f"{self.url}?q={city}&appid={os.environ.get('WEATHER_KEY')}&units=metric").json()
        temp_icon = {
            "temperature": response["main"]["temp"],
            "icon": response["weather"][0]["icon"]
        }
        return temp_icon

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
