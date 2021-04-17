from __future__ import annotations
from edna.ingest.streaming import BaseStreamingIngest
from edna.process import BaseProcess
from edna.emit import BaseEmit
from edna.serializers.EmptySerializer import EmptyStringSerializer

from urllib.parse import urlencode
import requests
from typing import Generator, List, Dict
import json

class BaseCTPIngest(BaseStreamingIngest):
    """Base class for streaming or filtering from the COVID Tracking Project. Subclasses can use additional
    *args and **kwargs in the `setup()` method.

    Attributes:
        states_fields (Dict[str, type]): Valid keys for state values from the COVID Tracking Project API
        us_fields (Dict[str, type]): Valid keys for US values from the COVID Tracking Project API
        base_url (str): The endpoint for the streaming or filter request.

    Raises:
        Exception: If the instance cannot connect to the API endpoint.
        NotImplementedError: If `base_url` is not set up in the inheriting class.
        ValueError: Incorrectly formatted `base_url`

    Yields:
        (obj): A call to `__next__()` will yield a single record from the stream.
    """
    states_fields: Dict[str,type] = {    "checkTimeEt": str, "commercialScore": int, "dataQualityGrade": str, "date": int, "dateChecked": str,
                        "dateModified": str, "death":int, "deathConfirmed": int, "deathIncrease": int, "deathProbable": int, "fips": str, "grade": str,
                        "hash": str, "hospitalized": int, "hospitalizedCumulative": int, "hospitalizedCurrently": int, "hospitalizedDischarged": int,
                        "hospitalizedIncrease": int, "inIcuCumulative": int, "inIcuCurrently": int, "lastUpdateEt": str, "negative": int, 
                        "negativeIncrease": int, "negativeRegularScore": int, "negativeScore": int, "negativeTestsAntibody": int, 
                        "negativeTestsPeopleAntibody": int, "negativeTestsViral": int, "onVentilatorCumulative": int, "onVentilatorCurrently": int, 
                        "pending": int, "posNeg": int, "positive": int, "positiveCasesViral": int, "positiveIncrease": int, "positiveScore": int, 
                        "positiveTestsAntibody": int, "positiveTestsAntigen": int, "positiveTestsPeopleAntibody": int, "positiveTestsPeopleAntigen": int, 
                        "positiveTestsViral": int, "probableCases": int, "recovered": int, "score": int, "state": str, "total": int, 
                        "totalTestEncountersViral": int, "totalTestResults": int, "totalTestResultsIncrease": int, "totalTestResultsSource": str, 
                        "totalTestsAntibody": int, "totalTestsAntigen": int, "totalTestsPeopleAntibody": int, "totalTestsPeopleAntigen": int, 
                        "totalTestsPeopleViral": int, "totalTestsViral": int
                        }
    us_fields: Dict[str,type] = {   "date": int, "dateChecked": str, "death": int, "deathIncrease": int, "hash": str, "hospitalized": int,
                        "hospitalizedCumulative": int, "hospitalizedCurrently": int, "hospitalizedIncrease": int, "inIcuCumulative": int, 
                        "inIcuCurrently": int, "lastModified": str, "negative": int, "negativeIncrease": int, "onVentilatorCumulative": int, 
                        "onVentilatorCurrently": int, "pending": int, "posNeg": int, "positive": int, "positiveIncrease": int, "recovered": int, 
                        "states": int, "total": int, "totalTestResults": int, "totalTestResultsIncrease": int
                        }

    states: list = ['WI', 'DE', 'ID', 'NC', 'WY', 'RI', 'AL', 'CA', 'SC', 'SD', 'TN', 'ME', 'MD', 'PR', 'CO', 'VI', 'MN', 'NV', 'KY', 'MS', 'MO', 
                    'AS', 'KS', 'IL', 'OK', 'MI', 'PA', 'VT', 'MT', 'LA', 'GU', 'WV', 'OH', 'CT', 'AZ', 'GA', 'ND', 'TX', 'NH', 'OR', 'NE', 'VA', 
                    'DC', 'NM', 'AR', 'MA', 'MP', 'IN', 'FL', 'WA', 'NY', 'HI', 'IA', 'UT', 'AK', 'NJ']

    base_url : str

    def __init__(self, serializer: EmptyStringSerializer, location: str = None, timeframe: str = None,
                    request_fields: List[str] = None, *args, **kwargs):
        """Initializes the BaseCTPIngest class with the query fields to populate the received object 

        Args:
            serializer (EmptyStringSerializer): An empty serializer for convention.
            location (str): The location for which to retrieve data. Valid input: 'US' or state in states list. Defaults to returning all states.
            timeframe (str): The timeframe for which to retrieve data. Valid input: 'daily', 'current', or date in format 'YYYYMMDD'. Defaults to returning current.
            request_fields (List[str], optional): List of fields to retrieve. Defaults to None.
        """

        self.request_fields = request_fields
        if location in self.states:
            self.request_fields = self.verify_fields(request_fields, self.states_fields)
        elif location == "US":
            self.request_fields = self.verify_fields(request_fields, self.us_fields)

        timeframe = self.verify_timeframe(timeframe)

        self.url = self.build_url(location, timeframe)
        self.running = False
        self.response = Generator
        self.setup(*args, **kwargs)
        super().__init__(serializer=serializer, *args, **kwargs)

    def next(self):
        """Sets up a connection to the COVID Tracking Project API endpoint and retrieves records

        Returns:
            (obj): A single record from the COVID Tracking Project stream
        """
        if not self.running:
            self.response = self.build_response()
            self.running = True
        return next(self.response)
            
    def build_response(self):
        """Builds a response object to connect to the COVID Tracking Project API and returns a generator to yield records.

        Raises:
            Exception: If the instance cannot connect to the API endpoint.

        Yields:
            (Generator): A response generator the yields records from the COVID Tracking Project API.
        """
        response = requests.request("GET", self.url, stream=True)
        if response.status_code != 200:
            raise Exception("Cannot get stream (HTTP {}): {}".format(response.status_code, response.text))
        data = str(response.content)
        data = json.loads(data[data.index("b'")+2:data.index("\\n'")])
        if type(data) is dict:
            temp = list()
            temp.append(data)
            data = temp
        for record in data:
            yield str({f: record[f] for f in self.request_fields})

    def verify_fields(self, passed_field: List[str], referenced_field: Dict[str, str]):
        """A helper function to verify the requested fields.

        Args:
            passed_field (List[str]): The passed list of requested fields.
            referenced_field (Dict[str, str]): The internal fields to compare against.

        Returns:
            (List / None): Returns the filtered list of fields or None if no fields are valid.
        """
        if passed_field is not None:
            valid_fields = [item for item in passed_field if item in referenced_field]
            if len(valid_fields) > 0:
                return valid_fields
        return None

    def verify_timeframe(self, timeframe: str):
        """A helper function to verify the requested timeframe.

        Args:
            timeframe (str): The requested timeframe.

        Returns:
            (str): Returns the requested timeframe or 'current' if request not valid.
        """
        if timeframe is not None and (timeframe == 'daily' or timeframe == 'current' or (timeframe.isnumeric() and len(timeframe) == 8)):
            return timeframe
        return 'current'

    def build_url(self, location: str = None, timeframe: str = 'current'):
        """Helper function to build the query url

        Args:
            location (str): The location for which to retrieve data. Defaults to all states.
            timeframe (str): The timeframe for which to retrieve data. Defaults to current.

        Raises:
            NotImplementedError: If `base_url` is not set up in the inheriting class.
            ValueError: Incorrectly formatted `base_url`

        Returns:
            (str): Properly formatted url for streaming records.
        """
        if self.base_url is None:
            raise NotImplementedError
        if self.base_url[-1] != "/":
            raise ValueError("Base URL does not end with '/': {base_url}".format(base_url = self.base_url))
        loc_str = "states/"
        if location in self.states:
            loc_str += location+"/"
        elif location == "US":
            loc_str = "us/"
        return self.base_url+loc_str+timeframe+".json"

    def setup(self, *args, **kwargs):
        pass
