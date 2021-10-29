profsatreed
===========

All endpoints exclusively respond to GET requests.

	/
	/rate-advisor
	/rate-professer
	/search
		?q=search+thing
		&type=(professor|advisor)
		&topic=(race|gender|etc)
	/ratings
		/[row in table]

* `/`  Source a title and site summary and stuff from a specific row
  on a Google Sheet.
* `/rate-advisor` and `/rate-professor`  Embed a Google Form which
  saves to a private Google Sheet which in turn sends non-confidential
  fields to a public Google Sheet.  This allows us to privately keep
  track of who submitted what while not having to fiddle with private
  Oath tokens.
* `/search`  Search for information in the aforementioned public
  Google Sheet.  This will take a number of parameters to select by
  role, issue, etc.
* `/ratings`  Display a listing of abbreviated reviews.  Each review
  may be accessed through `/ratings/n` where `n` is that review's
  unique ID in the public Google Sheet.
