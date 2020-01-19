var browser = process.env.browser;
module.exports = function getConfig(){
    switch(browser){
        case 'chrome':
            // process.env.CHROME_BIN = "E:\\下载\\Chrome_v30.0.1599.69 (3)\\Chrome\\chrome.exe";
            return {
                browsers: ['Chrome'],
                singleRun: true,
            };
        case 'opera':
            process.env.OPERA_BIN="D:\\Program files (x86)\\Opera\\65.0.3467.78\\opera.exe";
            return {
                browsers: ['Opera'],
                singleRun: true
            };
        case 'firefox':
            return {
                browsers: ['Firefox'],
                singleRun: true
            };
        case 'ie':
            return {
                browsers: ['IE'],
                singleRun: true
            };
    }
};
