import eel
from datetime import datetime, date, time
from database import Database
from models import Person, Projekt, TimeLog

db = Database('data.json')

# Initialize the Eel app
eel.init("frontend/public")

# --- Person Functions ---
@eel.expose
def get_persons():
    return [person.model_dump() for person in db.get_persons()]

@eel.expose
def add_person(surname, first_name, email=None, phone=None, workplace=None):
    person = Person(
        surname=surname,
        first_name=first_name,
        email=email,
        phone=phone,
        workplace=workplace
    )
    return db.add_person(person)

@eel.expose
def update_person(person_id, surname, first_name, email=None, phone=None, workplace=None):
    person = Person(
        surname=surname,
        first_name=first_name,
        email=email,
        phone=phone,
        workplace=workplace
    )
    db.update_person(int(person_id), person)
    return "Person updated!"

@eel.expose
def delete_person(person_id):
    db.delete_person(int(person_id))
    return "Person deleted!"

# --- Time Logs Functions ---
@eel.expose
def get_time_logs(year, month):
    logs = db.get_time_logs(int(year), int(month))
    return [log.model_dump() for log in logs]

@eel.expose
def add_time_log(date_str, start_time_str, end_time_str, name, description):
    time_log = TimeLog(
        date=date.fromisoformat(date_str),
        start_time=time.fromisoformat(start_time_str),
        end_time=time.fromisoformat(end_time_str),
        name=name,
        description=description
    )
    return db.add_time_log(time_log)

@eel.expose
def delete_time_log(time_log_id):
    db.delete_time_log(int(time_log_id))
    return "Time log deleted!"

@eel.expose
def update_time_log(time_log_id, date_str, start_time_str, end_time_str, name, description):
    time_log = TimeLog(
        date=date.fromisoformat(date_str),
        start_time=time.fromisoformat(start_time_str),
        end_time=time.fromisoformat(end_time_str),
        name=name,
        description=description
    )
    db.update_time_log(int(time_log_id), time_log)
    return "Time log updated!"

# --- Project Functions ---
@eel.expose
def get_projects():
    return [project.model_dump() for project in db.get_projects()]

@eel.expose
def add_project(data):
    project = create_project_from_data(data)
    return db.add_project(project)

@eel.expose
def delete_project(project_id):
    db.delete_project(int(project_id))
    return "Project deleted!"

@eel.expose
def update_project(project_id, data):
    project =create_project_from_data(data)
    db.update_project(project_id=project_id, project=project)
    return "Project updated!"

# Eel app startup arguments
eel_kwargs = dict(
    host='localhost',
    port=8080,
    size=(1280, 800),
)



def create_project_from_data(data):
    if data["vereinbartes_honorar"] is not None:
        data["vereinbartes_honorar"] = float(data["vereinbartes_honorar"])
    if data["prognosetage"] is not None:
        data["prognosetage"] = int(data["prognosetage"])
    project = Projekt(
        name=data['name'],
        kunde=data['kunde'],
        redaktion=data['redaktion'],
        kontaktperson=data['kontaktperson'],
        vereinbartes_honorar=data['vereinbartes_honorar'],
        prognosetage=data['prognosetage'],
        projektart=data['projektart'],
        rechnungsnummer=data['rechnungsnummer']
    )
    return project





# Start the app
eel.start("index.html", **eel_kwargs)
