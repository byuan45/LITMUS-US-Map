from edna.ingest.streaming.BaseCTPIngest import BaseCTPIngest

class CTPStreamingIngest(BaseCTPIngest):
    """Class for streaming from the COVID Tracking Project.

    Attributes:
        base_url (str): The endpoint for the streaming or filter request.
    """
    base_url = " https://api.covidtracking.com/v1/"