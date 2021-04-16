from edna.serializers import Serializable
from edna.process import BaseProcess
from edna.emit import BaseEmit
from edna.ingest import BaseIngest
from edna.serializers import Serializable
from edna.types.enums import IngestPattern

from typing import Iterator

class BaseStreamingIngest(BaseIngest, Iterator):
    """BaseStreamingIngest is the base class for generating records from a streaming source, e.g. Kafka.
    
    Any child class must:

    - Call `super().__init__()` at the end of initialization
    
    - Implement the `next()` method. This should be done as a generator that 
            fetches records in the background and yields them when it is called.
    
    Child classes should NOT:

    - modify the `__call__()` method
    
    - modify the `__iter__()` method

    Attributes:
        execution_mode (IngestPattern): Sets this primitive as a `CLIENT_SIDE_STREAM`. 
            The logic for execution is set up in `edna.core.execution.context.SimpleStreamingContext`.
    """    
    execution_mode = IngestPattern.CLIENT_SIDE_STREAM
    def __init__(self, serializer: Serializable, in_serializer: Serializable = None, out_serializer: Serializable = None, *args, **kwargs):
        """Initialize the primitive with the serializer.

        Args:
            serializer (Serializable): Serializer for deserialize the streaming records.
        """
        super().__init__(serializer, in_serializer, out_serializer, *args, **kwargs)
    
    def __iter__(self):
        """Returns itself as the iterator.

        Returns:
            (Iterator) : The class as an iterator.
        """
        return self

    def __next__(self):
        """Fetches the next record from the source.

        Returns:
            (List[obj]): Single fetched record in a singleton format.
        """
        return [self.in_serializer.read(self.next())]

    def next(self):
        """Method that encapsulates record fetching logic.

        Raises:
            NotImplementedError: Child classes should implement this method.
        """
        raise NotImplementedError

from .TwitterStreamingIngest import TwitterStreamingIngest
from .TwitterFilteredIngest import TwitterFilteredIngest
from .CDCStreamingIngest import CDCStreamingIngest

from .KafkaIngest import KafkaIngest
from .SimulatedIngest import SimulatedIngest

__pdoc__ = {}
__pdoc__["BaseStreamingIngest.__iter__"] = True
__pdoc__["BaseStreamingIngest.__next__"] = True