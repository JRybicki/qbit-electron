function createAxios() {
    const axios = require('axios');
    return axios.create({withCredentials: true});
}

class APIData {
    constructor(axiosVar, callback, callbackGlobal, address, username, password) {
        this.axios = axiosVar;
        this.initParams = 3;
        this.initDone = false;

        this.callbackFunc = callback;
        this.callbackGlobFunc = callbackGlobal;
        this.torAdrr  = address;
        this.torUser = username;
        this.torPass = password;
    }

    initAuth() {
        var self = this;
        this.getAuth(self);
    }

    //Get a few init parameters
    initData() {
        var self = this;
        this.getAPPData(self);
        this.getAPIData(self);
        this.getSavePath(self);
    }

    checkInit() {
        this.initParams--;

        if (this.initParams == 0) {
            console.log("APP ver: " + this.appVer);
            console.log("API ver: " + this.apiVer);
            console.log("Save Path: " + this.torPath);
            this.initDone = true;
            this.callbackFunc(this.apiVer, this.appVer, this.torPath);
        } else {
            console.log("init params:" + this.initParams);
        }
    }

    pollGlobal() {
        if(this.initDone == false) {
            console.log("waiting for init");
        } else {
            var self = this;
            this.getTransferInfo(self, this.callbackGlobFunc);
        }
    }


    async getAuth(self) {
        try {
          const response = await self.axios.get(self.torAdrr + '/api/v2/auth/login?username=' + self.torUser + '&password=' + self.torPass, {});
          self.axios.defaults.headers.cookie = response.headers['set-cookie'];
          //console.log(response.headers['set-cookie']);
          self.initData();
        } catch (error) {
          console.error(error);
        }
    }

    async getAPPData(self) {
        try {
          const response = await self.axios.get(self.torAdrr + '/api/v2/app/version', { });
          self.appVer = response.data;
          self.checkInit();
        } catch (error) {
          console.log('error');
        }
    }

    async getAPIData(self) {
        try {
          const response = await self.axios.get(self.torAdrr + '/api/v2/app/webapiVersion', { });
          self.apiVer = response.data;
          self.checkInit();
        } catch (error) {
          console.log('error');
        }
    }

    async getSavePath(self) {
        try {
          const response = await self.axios.get(self.torAdrr + '/api/v2/app/defaultSavePath', { });
          self.torPath = response.data;
          self.checkInit();
        } catch (error) {
          console.log('error');
        }
    }

    async getTransferInfo(self, callback) {
        try {
          const response = await self.axios.get(self.torAdrr + '/api/v2/transfer/info', { });
          //console.log(response.data);
          this.callbackGlobFunc(response.data.dl_info_data, response.data.up_info_data, response.data.dl_info_speed, response.data.up_info_speed);
        } catch (error) {
          console.log('error');
        }
    }


    axios = undefined;
    appVer = undefined;
    apiVer = undefined;
    initParams = undefined;
    callbackFunc = undefined;
    callbackGlobFunc = undefined;
    initDone = undefined;

    torAdrr = undefined;
    torUser = undefined;
    torPass = undefined;
    torPath = undefined;
}

apiReq = undefined;
module.exports = {
    startAPI: function (callback, callbackGlobal, address, username, password) {
        console.log('foo function')
        axios = createAxios();

        //This will authenticate and get some version data
        apiReq = new APIData(axios, callback, callbackGlobal, address, username, password);
        apiReq.initAuth();
    },

    runAPI: async function() {
        setInterval(pollFunction, 1000);
    }
};

function pollFunction() {
    apiReq.pollGlobal();
}