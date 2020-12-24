from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///./db/cities.db', echo=True)
Base = declarative_base()
Session = sessionmaker(bind=engine)


class City(Base):
    __tablename__ = "cities"

    id_city = Column(Integer, primary_key=True, autoincrement="auto")
    name = Column(String, nullable=False)
    latitude = Column(Float(precision=6), nullable=False)
    longitude = Column(Float(precision=6), nullable=False)

    def __repr__(self):
        return f"<City {self.name}>"



Base.metadata.create_all(engine)

def add_city(name: str, lon: float, lat: float):
    session = Session()
    session.add(City(name=name, 
                     longitude=lon, 
                     latitude=lat))
    session.commit()
