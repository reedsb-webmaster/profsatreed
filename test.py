#!/usr/bin/env python3

"""
Unit tests for the profsatreed backend.

This file test the portions of profsatreed responsible for processing
URLS and fetching the appropriate data from Firebase.  In order to do
this it sets up a local SQLite3 database, overrides the database
retrieval function, and runs through a set of example interactions.

The tests do not cover any of the HTML rendering functions.
"""

import sqlite3
import unittest

import profsatreed
