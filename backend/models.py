from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date, time

class Person(BaseModel):
    nachname: str
    vorname: str
    email: Optional[EmailStr] = None
    telefonnummer: Optional[str] = None
    firma: Optional[str] = None

class Projekt(BaseModel):
    name: str 
    id: Optional[int] = None
    kunde: Optional[str] = None
    redaktion: Optional[str] = None
    kontaktperson: Optional[str] = None
    vereinbartes_honorar: Optional[float] = None
    prognosetage: Optional[int] = None
    projektart: Optional[str] = None
    rechnungsnummer: Optional[str] = None


class TimeLog(BaseModel):
    id: Optional[int] = None
    date: date
    start_time: time
    end_time: time
    project_id: int
    description: str
