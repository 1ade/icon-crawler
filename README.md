# icon-crawler
This app is a web-service that scrapes a site for an icon given its domain name.

### Repository
https://github.com/1ade/icon-crawler

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
1. Download or Clone repository https://github.com/1ade/icon-crawler.git
2. Using the command line go to '/icon-crawler/crawler' directory 
3. Type 'npm install' then hit the 'enter' key.
4. Wait till installation is done
5. Type 'node app.js', you should see 'Express server listening on port 3000 in development mode'.
6. With curl; type 'curl http://localhost:3000/get/?domain=www.google.com' in your command line then hit the 'enter' key.
7. Without curl; launch a web browser, type 'http://localhost:3000/get/?domain=www.google.com' then hit the 'enter' key.
8. An icon should be returned as the response.

### Thoughts
 - Set up of a cache (filesystem ? database ?), to not have to fetch the images on the website each time

The filesystem is used as a cache. Retrieve icons are stored on the system the first time around and fetched directly From the file system on subsequent calls increasing the response time.

- If this cache was to be implemented, what strategies to update it should the icons of the website change?

A schedule job has been implemented using the native timer setInterval(func , delay) function the delay has been set to daily.
This job is responsible for updating the icons

- If 2 requests for the same domain are received in a short time interval, is there a way to deal with them in a smart way?

- If the icon has already been cached there should be no issue here the cached version would simply be returned, if it hasn't The following steps can be followed;
	- First thread (i.e. initial request) stores the domain currently being processed the first. 
	- Second thread comes in, checks if its name is being flagged as processing.
	- If yes, listen to a designated folder till its file exists.
	- Then return cached copy.

- How to choose the best image? Is it better to try to parallelize the different strategies or do them sequentially?

The best image was chosen by selecting the icon with the largest bytes from a collection of icons defined in the 'link' tag
of the domain name's 'head' element with 'rel' attribute that had value 'icon' or started with 'apple-touch-icon'. The url domain_name/favicon.ico was also included in the collection.It is better to parallelize the strategies for performance reasons.

- Rate limiting (per domain, per ip?)

Rate limiting per domain is preferred as different ips can be related to a single domain.

- Possible architecture, if we were to scale to millions of users / requests per day...

Possible scalling solutions
Proxy Based scalling
Load Balancing using apache or nginx.
The nodejs app can be deployed on various servers where traffic can be directed to using ProxyPass module in the case of apache and proxy/reverse proxy when using nginx 

Application Based scalling
This can be done using node_cluster, PM2. These methods distribute tasks amongst worker processes managed by a master process.
