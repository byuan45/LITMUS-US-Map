from edna.ingest.streaming import CTPStreamingIngest
from edna.process import BaseProcess
from edna.emit import StdoutEmit
from edna.serializers.EmptySerializer import EmptyStringSerializer
from edna.core.execution.context import SimpleStreamingContext

def main():
    
    context = SimpleStreamingContext()
    
    ingest_serializer = EmptyStringSerializer
    emit_serializer = EmptyStringSerializer
    ingest = CTPStreamingIngest(serializer=ingest_serializer, 
        location=context.getVariable("location"),
        timeframe=context.getVariable("timeframe"),
        request_fields=context.getVariable("request_fields"))
    process = BaseProcess()
    emit = StdoutEmit(serializer=emit_serializer)

    context.addIngest(ingest)
    context.addProcess(process)
    context.addEmit(emit)
    
    context.execute()

if  __name__=="__main__":
    main()