import requests
import json
import os


class WeatherRetriever:
    def __init__(self, url: str = "http://api.openweathermap.org/data/2.5/weather"):
        self.url = url

    def get_weather(self, city: str) -> dict:
        key = os.environ.get('WEATHER_KEY')
        response = requests.get(f"{self.url}?q={city}&appid={key}&units=metric").json()
        """ требуемые поля:
            timezone (сдвиг в секундах от utc)
            main.temp 
            main.feels_like
            main.humidity
            weather.icon
        """
        result = {
            "timezone": response["timezone"] / 3600,
            "current_temperature": response["main"]["temp"],
            "feels_like": response["main"]["feels_like"],
            "humidity": response["main"]["humidity"]
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
