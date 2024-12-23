from tinydb import TinyDB, Query
from datetime import datetime
from models import Person, Projekt, TimeLog

class Database:
    def __init__(self, db_name):
        self.db = TinyDB(db_name)
        self.projects = self.db.table('projects')
        self.time_logs = self.db.table('time_logs')
        self.persons = self.db.table('persons')

    # Methods for persons
    def add_person(self, person: Person) -> int:
        person_dict = person.model_dump()
        if "id" in person_dict: # remove key because it is None and should be created by the database
            del person_dict["id"]
        return self.persons.insert(person_dict)

    def get_persons(self) -> list[Person]:
        return [Person(**person) for person in self.persons.all()]

    def update_person(self, person_id: int, person: Person) -> None:
        self.persons.update(person.model_dump(), doc_ids=[person_id])

    def delete_person(self, person_id: int) -> None:
        self.persons.remove(doc_ids=[person_id])

    # Methods for projects
    def add_project(self, project: Projekt) -> int:
        project_dict = project.model_dump()
        if "id" in project_dict: # remove key because it is None and should be created by the database
            del project_dict["id"]
        return self.projects.insert(project_dict)

    def get_projects(self) -> list[Projekt]:
        return [Projekt(id=project.doc_id, **{k: v for k, v in project.items() if k != "id"}) for project in self.projects.all()]


    def update_project(self, project_id: int, project: Projekt) -> None:
        self.projects.update(project.model_dump(), doc_ids=[project_id])

    def delete_project(self, project_id: int) -> None:
        self.projects.remove(doc_ids=[project_id])

    # Methods for time logs
    def add_time_log(self, time_log: TimeLog) -> int:
        time_log_dict = time_log.model_dump()
        time_log_dict['date'] = str(time_log_dict['date'])
        time_log_dict['start_time'] = str(time_log_dict['start_time'])
        time_log_dict['end_time'] = str(time_log_dict['end_time'])
        return self.time_logs.insert(time_log_dict)

    def get_time_logs(self, year: int, month: int) -> list[TimeLog]:
        Query_obj = Query()
        time_logs = self.time_logs.search(
            (Query_obj.date.test(lambda x: str(year) == x.split('-')[0])) &
            (Query_obj.date.test(lambda x: f"{int(month):02d}" == x.split('-')[1]))
        )
        return [TimeLog(**log) for log in time_logs]

    def update_time_log(self, time_log_id: int, time_log: TimeLog) -> None:
        time_log_dict = time_log.model_dump()
        time_log_dict['date'] = str(time_log_dict['date'])
        time_log_dict['start_time'] = str(time_log_dict['start_time'])
        time_log_dict['end_time'] = str(time_log_dict['end_time'])
        self.time_logs.update(time_log_dict, doc_ids=[time_log_id])

    def delete_time_log(self, time_log_id: int) -> None:
        self.time_logs.remove(doc_ids=[time_log_id])