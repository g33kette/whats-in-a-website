
# Chrome Plugin: Browser Protect

Browser plugin for dissertation project "What's in a Website"

Joanne Buxton | MSC Knowledge Discovery and Data Mining | University of East Anglia 2016-2019

## Development Installation

### Install packages

```
 > npm ci
 > npm run build
```

### Development
```
> npm run watch
```

### Enable in Chrome

 - Go to **More Tools** > **Extensions**
 - Turn on **Developer Mode**
 - Click **Load Unpacked** and open _/project-folder/dist_

### Testing
```
> npm run test // Jest Integration Tests
> npm run test // CucumberJS E2E Selenium Tests
```

### Testing setup on Windows:
 - Install Visual Studio 2019 with C++ stuff: https://visualstudio.microsoft.com/downloads/
 - Install Python 2.7 https://www.python.org/download/releases/2.7/
 - Install windows-build-tools globally in administrator console
    > npm install --production windows-build-tools -g
