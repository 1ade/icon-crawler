# icon-crawler
This app is a web-service that scrapes a site for an icon given its domain name.

### Dependencies
Node.js
> ###### Node Modules used
	- request
	- cheerio
	- Q
	- fs
	- path
	- express
	- validator
curl or any web-browser

### To Run
1. Download or Clone repository
2. Using the command line go to '/icon-crawler/crawler' directory 
3. Type 'npm install' then hit the 'enter' key.
4. Wait till installation is done
5. Type 'node app.js', you should see 'Express server listening on port 3000 in development mode'.
6. With curl; type 'curl http://localhost:3000/get/?domain=www.google.com' in your command line then hit the 'enter' key.
7. Without curl; launch a web browser, type 'http://localhost:3000/get/?domain=www.google.com' then hit the 'enter' key.
8. An icon should be returned as the response.