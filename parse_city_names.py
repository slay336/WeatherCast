import json
from db import Session, City

with open('cities_info.json', 'r') as f:
    session = Session()
    for city in json.loads(f.read()):
        if not session.query(City).filter(City.name==city["name"]).all():
            new_city = City(name=city["name"],
                            longitude=city["coord"]["lon"],
                            latitude=city["coord"]["lat"])
            session.add(new_city)
    session.commit()

