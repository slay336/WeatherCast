from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///./db/cities.db', echo=False)
Base = declarative_base()
Session = sessionmaker(bind=engine)


class City(Base):
    __tablename__ = "cities"

    id_city = Column(Integer, primary_key=True, autoincrement="auto")
    name = Column(String, nullable=False)
    latitude = Column(Float(precision=6), nullable=False)
    longitude = Column(Float(precision=6), nullable=False)

    def __repr__(self):
        return f"<City {self.name} lon:{self.longitude} lat:{self.latitude}>"



Base.metadata.create_all(engine)

def add_city(name: str, lon: float, lat: float):
    """
    Используется для фиксации города в БД
    """
    session = Session()
    session.add(City(name=name, 
                     longitude=lon, 
                     latitude=lat))
    session.commit()

def get_city_coord(name: str) -> City:
    session = Session()
    city_coords = session.query(City.latitude, City.longitude).filter(City.name==name).first()
    session.commit()
    return city_coords