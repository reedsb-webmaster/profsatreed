#!/usr/bin/env python3

"""
Helper script to generate html files from a template
"""

from mako.template import Template

t = Template(filename="template.html")


def home() -> str:
    """
    Assemble the site's home page
    """
    return t.render(title = "Home | Profs at Reed",
                    pageheader = "Home")

def advisor_feedback() -> str:
    """
    Assemble a feedback form for the advisor role.
    """
    return t.render(title = "Advisor Feedback | Profs at Reed",
                    pageheader = "Advisor Feedback")

def professor_feedback() -> str:
    """
    Assemble a feedback form for the advisor role.
    """
    return t.render(title = "Professor Feedback | Profs at Reed",
                    pageheader = "Professor Feedback")

def results() -> str:
    """
    Assemble a page with a list of the results, requested from the "database".
    """
    return t.render(title = "View Feedback | Profs at Reed",
                    pageheader = "View Feedback")

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
