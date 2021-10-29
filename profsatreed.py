#!/usr/bin/env python3

"""
Backend for profsatreed.com
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import traceback

class DataNotFound(Exception):
    """
    Raised to signal the server to return a 404 when some information
    isn't found in the the database
    """

def page_home(path: str) -> str:
    """
    Assemble the site's home page
    """
    msg = "TODO: replace me with a template<br>"
    return msg + "Path: " + path

def responder(req, pagebuilder):
    """
    Wrap-up the task of sending an ok HTML page back to the user.  The
    argument PAGEBUILDER is a function that takes the full request
    path as an argument and returns a fully assembled HTML page.
    """
    try:
        html = pagebuilder(req.path)
    except:
        return
    req.send_response(200)
    req.send_header("Content-type", "text/html")
    req.end_headers()
    req.wfile.write(bytes(html, "utf8"))

class Handler(BaseHTTPRequestHandler):
    """
    In order to make prototyping easier we'll use Python's built-in HTTP
    server module.  We should probably stick this behind a reverse-proxy
    on the actual server.
    """
    def do_GET(self):
        """
        Define the site's GET endpoints.  We'll also need to pass
        images and stylesheets and stuff.
        """
        try:
            if self.path == "/":
                responder(self, page_home)
            else:
                self.send_error(404)
        except DataNotFound:
            self.send_error(404)
        except:
            self.send_error(500)
            traceback.print_exc()

# Start Python's web server when this file is being ran directly
if __name__ == "__main__":
    with HTTPServer(("", 8000), Handler) as server:
        server.serve_forever()
