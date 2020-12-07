# test_axios

#### Describe the bug

I observe a memory leak when I request a file and pipe to another request and I get the error "Request body larger than maxBodyLength limit"

#### To Reproduce

To reproduce the problem, I request a file of 20MB and pipe to another request.
Bellow there a sample code:

```js
const optsGetFile = {
  method: "get",
  url: "http://localhost:7001/download",
  responseType: "stream",
};
const optsUploadFile = {
  method: "post",
  url: "http://localhost:7001/upload",
};

axios(optsGetFile)
  .then(({ headers, data }) => {
    return axios(_.assign(optsUploadFile, { data, headers }));
  })

```
The entire test code is present at [https://github.com/jose-lopes/test_axios](https://github.com/jose-lopes/test_axios) .
Next I will describe the environment that I setup to reproduce the problem.

* Start fake server. (This program serve /upload and /download (20MB) requests)

```
node test_fakeserver.js
```

* Start test server and monitor memory with [memory-profiler](https://pypi.org/project/memory-profiler/). (This program serve /record request, which it get /download and post to /upload)

```
mprof run node test.js
```

* execute 20 /record requests with interval of 30 seconds

```
for test in $(seq 1 20); do curl -X POST localhost:7000/record; sleep 30; done
```

* Stop test server and execute mprof plot to check memory behavior.

```
mprof plot
```


#### Expected behavior

I expected no memory leak even when we got the error "Request body larger than maxBodyLength limit".
I executed again the test server with option maxBodyLength: 30*1024*1024 and I got no memory leak.


#### Environment
 - Axios Version: 0.21.0
 - Node.js Version: v14.15.0
 - OS: Arch Linux

#### Additional context/Screenshots

Graph when I execute to reproduce:
![Test Result](https://raw.githubusercontent.com/jose-lopes/test_axios/master/images/test.png)

