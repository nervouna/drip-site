"""Serve the repository root on 127.0.0.1:8765 for previews and tools/qa.mjs."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class Server(ThreadingHTTPServer):
    # http.server's listen backlog of 5 makes Chrome reset parallel image loads.
    request_queue_size = 128


root = Path(__file__).resolve().parent.parent
with Server(('127.0.0.1', 8765), partial(SimpleHTTPRequestHandler, directory=root)) as server:
    print('Serving http://127.0.0.1:8765/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
