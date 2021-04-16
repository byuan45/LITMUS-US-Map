from edna.ingest.streaming.BaseCDCIngest import BaseCDCIngest

class CDCStreamingIngest(BaseCDCIngest):
    """Class for streaming from Twitter using the v2 API endpoints.

    Attributes:
        base_url (str): The endpoint for the streaming or filter request.
    """
    base_url = "https://data.cdc.gov/resource/n8mc-b4w4.json?$$app_token=DKCa0OoSaXWjLHitcQ5gRIHSz"