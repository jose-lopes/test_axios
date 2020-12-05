# test_axios

#### Describe the bug

I observe a memory leak when I pipe two requests with file and get the error "Request body larger than maxBodyLength limit"

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

Next I will describe the environment that I setup to reproduce the problem.

* Start fake server

```
node test_fakeserver.js
```

* Start test server and monitor memory with [memory-profiler](https://pypi.org/project/memory-profiler/)

```
mprof run node test.js
```

* execute 20 test requests with interval of 30 seconds

```
for test in $(seq 1 20); do curl -X POST localhost:7000/record; sleep 30; done
```

All test code is present at https://github.com/jose-lopes/test_axios

The execution produces the next graph:

![Test Result](https://raw.githubusercontent.com/jose-lopes/test_axios/master/images/test.png)

#### Expected behavior

I was expected no memory leak even we got the error "Request body larger than maxBodyLength limit".
I executed again the test with option maxBodyLength: 30*1024*1024 and got the next graph without memory leak.

![Test Result](https://raw.githubusercontent.com/jose-lopes/test_axios/master/images/testExpected.png)

#### Environment
 - Axios Version: 0.21.0
 - Node.js Version: v14.15.0
 - OS: Arch Linux
