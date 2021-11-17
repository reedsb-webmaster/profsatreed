#!/usr/bin/env python3

"""
Backend for profsatreed.com
"""

from http.server import CGIHTTPRequestHandler, HTTPServer
from mako.template import Template
import traceback

t = Template(filename="template.html")

advisor_form = "https://docs.google.com/forms/d/e/1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q/viewform?embedded=true"

professor_form = "https://docs.google.com/forms/d/e/1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q/viewform?embedded=true"

class DataNotFound(Exception):
    """
    Raised to signal the server to return a 404 when some information
    isn't found in the the database
    """

def page_home(path: str) -> str:
    """
    Assemble the site's home page
    """
    return t.render(title = "Home | Profs at Reed",
                    pageheader = "Home",
                    body = "Welcome!")

def page_advisor_feedback(path: str) -> str:
    """
    Assemble a feedback form for the advisor role.  The PATH argument is
    unused
    """
    return t.render(title = "Advisor Feedback | Profs at Reed",
                    pageheader = "Advisor Feedback",
                    body = "<iframe src='" + professor_form + "'>loading...<iframe>")

def page_professor_feedback(path: str) -> str:
    """
    Assemble a feedback form for the advisor role.  The PATH argument is
    unused
    """
    return t.render(title = "Professor Feedback | Profs at Reed",
                    pageheader = "Professor Feedback",
                    body = "<iframe src='" + professor_form + "'>loading...<iframe>")

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

class Handler(CGIHTTPRequestHandler):
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
            elif self.path == "/advisor-feedback":
                responder(self, page_advisor_feedback)
            elif self.path == "/professor-feedback":
                responder(self, page_professor_feedback)
            else:
                try:
                    lpath = self.translate_path(self.path)
                    with open(lpath, "rb") as file:
                        self.send_response(200)
                        self.send_header("Content-type", self.guess_type(lpath))
                        self.end_headers()
                        self.wfile.write(file.read())
                except FileNotFoundError:
                    self.send_error(404)
                except:
                    self.send_error(500)
                    traceback.print_exc()
        except DataNotFound:
            self.send_error(404)
        except:
            self.send_error(500)
            traceback.print_exc()

# Start Python's web server when this file is being ran directly
if __name__ == "__main__":
    with HTTPServer(("", 8000), Handler) as server:
        server.serve_forever()
