from edna.emit import BaseEmit
from edna.serializers import Serializable

class FileEmit(BaseEmit):
    """An Emitter that writes to a text file"""
    def __init__(self, serializer: Serializable, filename: str, *args, **kwargs):
        self.filename=filename
        # Clear the file
        file = open(self.filename,"r+")
        file.truncate(0)
        file.close()
        super().__init__(serializer=serializer, *args, **kwargs)

    def write(self):
        """Writes the message to a text file. Ideally, the message should be a string."""
        # NOT an efficient method, but really, who uses this for a real Job?
        with open(self.filename, 'a') as f:
            for buffer_idx in range(self.emit_buffer_index+1):
                print(self.emit_buffer[buffer_idx], file=f)

        