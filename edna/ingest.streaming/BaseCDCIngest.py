from __future__ import annotations
from edna.ingest.streaming import BaseStreamingIngest
from edna.process import BaseProcess
from edna.emit import BaseEmit
from edna.serializers.EmptySerializer import EmptyStringSerializer

from urllib.parse import urlencode
import requests
from typing import Generator, List, Dict

class BaseCDCIngest(BaseStreamingIngest):
    cdc_fields: Dict[str,type] = {    "case_month": str, "res_state": str, "state_fips_code": str, "res_county": str, "county_fips_code": str, "age_group": str,
                        "sex":str, "race": str, "ethnicity": str, "process": str, "exposure_yn": str, "current_status": str,
                        "symptom_status": str, "hosp_yn": str, "icu_yn": str, "death_yn": str
                        }
    base_url : str

    def __init__(self, serializer: EmptyStringSerializer, cdc_fields: List[str] = None, *args, **kwargs):

        cdc_fields = self.verify_fields(cdc_fields, self.cdc_fields )
        print(self.build_url(cdc_fields))
        self.url = self.build_url(cdc_fields)
        #self.headers = self.create_headers()
        #add in empty dictoary if doesnt work
        self.running = False
        self.response = Generator
        self.setup(*args, **kwargs)
        super().__init__(serializer=serializer, *args, **kwargs)

    def next(self):
        """Sets up a connection to the Twitter API endpoint and retrieves records

        Returns:
            (obj): A single record from the Twitter stream
        """
        if not self.running:
            self.response = self.build_response()
            self.running = True
        return next(self.response)
            
    def build_response(self):
        """Builds a response object to connect to the Twitter stream and returns a generator to yield records.

        Raises:
            Exception: If the instance cannot connect to the API endpoint.

        Yields:
            (Generator): A response generator the yields records from the Twitter stream.
        """
        response = requests.request("GET", self.url, stream=True)
        print(self.url)
        if response.status_code != 200:
            raise Exception("Cannot get stream (HTTP {}): {}".format(response.status_code, response.text))
        for record in response.iter_lines():
            yield record

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

    def build_url(self, cdc_fields: List[str] = None):
        """Helper function to build the query url

        Args:
            tweet_fields (List[str], optional): List of tweet fields to retrieve. Defaults to None.
            user_fields (List[str], optional): List of user fields to retrieve. Defaults to None.
            media_fields (List[str], optional): List of media fields to retrieve. Defaults to None.
            poll_fields (List[str], optional): List of poll fields to retrieve. Defaults to None.
            place_fields (List[str], optional): List of place fields to retrieve. Defaults to None.

        Raises:
            NotImplementedError: If `base_url` is not set up in the inheriting class.
            ValueError: Incorrectly formatted `base_url`

        Returns:
            (str): Properly formatted url for streaming records.
        """
        if self.base_url is None:
            raise NotImplementedError
        # if self.base_url[-1] != "?":
        #     raise ValueError("Base URL does not end with '?': {base_url}".format(base_url = self.base_url))
        vars = {    "cdc.fields":cdc_fields, 
                     }
        # vars = {item:",".join(vars[item]) for item in vars if vars[item] is not None}
        # encoded_suffix = urlencode(vars)
        # if len(encoded_suffix):
        #     return self.base_url+urlencode(vars)
        # else:
        #     return self.base_url[:-1]
        return self.base_url
    def create_headers(self):
        """Helper function to create headers for a request.

        Args:
            bearer_token (str): Authenticating v2 bearer token.

        Returns:
            (dict): Header object
        """
        return {}

    def setup(self, *args, **kwargs):
        pass
