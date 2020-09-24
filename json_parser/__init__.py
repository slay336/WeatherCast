import requests
import json
import os


class WeatherRetriever:
    def __init__(self, url: str):
        self.url = url

    def get_weather(self, city: str) -> str:
        response = requests.get(f"{self.url}?q={city}&appid={os.environ.get('WEATHER_KEY')}").json()
        return response["main"]["temp"]

    @staticmethod
    def get_available_cities():
        with open("../cities.json", "r") as f:
            data = json.loads(f.read())
        cities = []
        for datum in data:
            cities.append(datum["name"])
        print(cities)


# if __name__ == "__main__":
#     weather = WeatherRetriever("http://api.openweathermap.org/data/2.5/weather")
#     print(weather.get_weather("Taglag"))
#     # WeatherRetriever.get_available_cities()
