import eel
from datetime import datetime, date, time
from database import Database
from models import Person, Projekt, TimeLog

db = Database('data.json')

# Initialize the Eel app
eel.init("frontend/public")
@eel.expose
def get_persons():
    persons = db.get_persons()
    return [person.model_dump() for person in persons]

@eel.expose
def add_person(surname, first_name, email=None, phone=None, workplace=None):
    person = Person(surname=surname, first_name=first_name, email=email, phone=phone, workplace=workplace)
    return db.add_person(person)

@eel.expose
def update_person(person_id, surname, first_name, email=None, phone=None, workplace=None):
    person = Person(id=person_id, surname=surname, first_name=first_name, email=email, phone=phone, workplace=workplace)
    return db.update_person(person)

@eel.expose
def delete_person(person_id):
    return db.delete_person(person_id)

@eel.expose
def get_time_logs(year, month):
    logs = db.get_time_logs(int(year), int(month))
    return [log.model_dump() for log in logs]

@eel.expose
def add_time_log(date_str, start_time_str, end_time_str, name, project_id, description=""):
    """Add a new time log entry to the database.
    
    Args:
        date_str (str): The date in ISO format (YYYY-MM-DD)
        start_time_str (str): Start time in ISO format (HH:MM)
        end_time_str (str): End time in ISO format (HH:MM)
        name (str): Project name
        description (str, optional): Time log description. Defaults to empty string.
        
    Raises:
        ValueError: If required fields are missing or invalid
        ValueError: If end time is before or equal to start time
    """
    print(f"Adding time log: date={date_str}, start={start_time_str}, end={end_time_str}, project={name}")
    
    # Clean and validate input parameters
    try:
        
        
        # Check for missing required fields
        if not all([date_str, start_time_str, end_time_str, project_id]):
            raise ValueError("Missing required fields")
            
        # Parse date and times
        log_date = date.fromisoformat(str(date_str).strip())
        start = time.fromisoformat(str(start_time_str).strip())
        end = time.fromisoformat(str(end_time_str).strip())
        
        # Validate time range
        if end <= start:
            raise ValueError("End time must be after start time")
            
        print(f"Creating time log: date={log_date}, start={start}, end={end}")
        
        # Create and save time log
        time_log = TimeLog(
            date=log_date,
            start_time=start,
            end_time=end,
            description=description,
            project_id=project_id
        )
        return db.add_time_log(time_log)
        
    except ValueError as e:
        print(f"Error adding time log: {str(e)}")
        raise ValueError(f"Invalid time log data: {str(e)}")

@eel.expose
def delete_time_log(time_log_id):
    return db.delete_time_log(time_log_id)

@eel.expose
def update_time_log(time_log_id, date_str, start_time_str, end_time_str, name, description):
    time_log = TimeLog(
        id=time_log_id,
        date=date.fromisoformat(date_str),
        start_time=time.fromisoformat(start_time_str),
        end_time=time.fromisoformat(end_time_str),
        name=name,
        description=description
    )
    return db.update_time_log(time_log)

@eel.expose
def get_projects():
    projects = db.get_projects()
    return [project.model_dump() for project in projects]

@eel.expose
def add_project(data):
    project = Projekt.model_validate(data)
    return db.add_project(project)

@eel.expose
def delete_project(project_id):
    return db.delete_project(project_id)

@eel.expose
def update_project(project_id, data):
    data['id'] = project_id
    project = Projekt.model_validate(data)
    return db.update_project(project_id, project)



# Eel app startup arguments
eel_kwargs = dict(
    host='localhost',
    port=8080,
    size=(1280, 800),
)
# Start the app
eel.start("index.html", **eel_kwargs)
