#!/usr/bin/env python3

"""
Helper script to generate html files from a template
"""

from mako.template import Template

t = Template(filename="template.html")

advisor_form = "https://docs.google.com/forms/d/e/1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q/viewform?embedded=true"

professor_form = "https://docs.google.com/forms/d/e/1FAIpQLSe750TrU5eKALR8WIZxF_4sKmpKwEnd77-1fNHCvCoMbkCj-Q/viewform?embedded=true"

def home() -> str:
    """
    Assemble the site's home page
    """
    return t.render(title = "Home | Profs at Reed",
                    pageheader = "Home",
                    body = "Welcome!")

def advisor_feedback() -> str:
    """
    Assemble a feedback form for the advisor role.
    """
    return t.render(title = "Advisor Feedback | Profs at Reed",
                    pageheader = "Advisor Feedback",
                    body = "<iframe src='" + professor_form + "'>loading...<iframe>")

def professor_feedback() -> str:
    """
    Assemble a feedback form for the advisor role.
    """
    return t.render(title = "Professor Feedback | Profs at Reed",
                    pageheader = "Professor Feedback",
                    body = "<iframe src='" + professor_form + "'>loading...<iframe>")

def results() -> str:
    """
    Assemble a page with a list of the results, requested from the "database".
    """
    return t.render(title = "View Feedback | Profs at Reed",
                    pageheader = "View Feedback",
                    body = "You'll be able to view feedback here.")

def gen_pages():
    with open("index.html", "w") as f:
        f.write(home())
    with open("advisor_feedback.html", "w") as f:
        f.write(advisor_feedback())
    with open("professor_feedback.html", "w") as f:
        f.write(professor_feedback())
    with open("results.html", "w") as f:
        f.write(results())
    
if __name__ == "__main__":
    gen_pages()
