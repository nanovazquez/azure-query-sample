// azureQuery
// A community donation of Neudesic
// azurequery.codeplex.com




// This base64 conversion function courtesy of a forum comment at http://www.codeproject.com/Articles/26980/Binary-Formats-in-JavaScript-Base64-Deflate-and-UT

var Base64 = new function () {
    for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), i = 64, d = []; i;) d[e[--i]] = i;
    this.e = function (A) {
        var s = [], i = 0, j = 0, n, l = A.length, m = l % 3;
        while (i < l) s[j++] = e[(n = A[i++] << 16 | A[i++] << 8 | A[i++]) >> 18 & 63] + e[n >> 12 & 63] + e[n >> 6 & 63] + e[n & 63];
        if (m) for (s[--j] = s[j].substr(0, s[j].length - (m = 3 - m)) ; m--;) s[j] += "=";
        return s.join("")
    }
    , this.d = function (s) {
        var A = [], i = 0, j = 0, l = (s = s.replace(/[^A-Za-z\d\+\/]/g, "")).length, m = l & 3, n;
        while (i < l) A[j++] = (n = d[s.charAt(i++)] << 18 | d[s.charAt(i++)] << 12 | d[s.charAt(i++)] << 6 | d[s.charAt(i++)]) >> 16, A[j++] = n >> 8 & 255, A[j++] = n & 255;
        A.length -= [0, 0, 2, 1][m];
        return A
    }
}


// Storage object

var azureQueryStorage = function (storageAccountName) {

    if (!storageAccountName) { storageAccountName = ''; }
    aq.storageOptions.storageAccountName = storageAccountName;
    this.containerCollection = [];
    this.blobCollection = [];
    this.blobValue = null;
}

azureQueryStorage.prototype = function () {

    // Storage functions.

    this.focus = "containers";
    this.dataType = "text";

    //*********************************
    //*                               *
    //*  A L L O W   D E L E T E S    *
    //*                               *
    //*********************************

    var allowDeletes = function (bool) {
        aq.storageOptions.allowDeletes = bool;
    },


    //********************
    //*                  *
    //*    B  L  O  B    *
    //*                  *
    //********************
    // selects a single blob

    blob = function (blobName) {

        var self = this;

        this.focus = "blob";
        this.currentBlobName = blobName;

        return self;
    },

    
    //***********************
    //*                     *
    //*    B  L  O  B  S    *
    //*                     *
    //***********************
    // Return a list of blobs.

    blobs = function (/* blobName or 'blobList' or blobList */) {

        var args = Array.prototype.slice.call(arguments);
        var blobName = args.join(',');
        if (args.length === 0) blobName = '';
        
        var url = "/api/blob/blobs/?c=" + this.currentContainerName;
        var self = this;

        this.focus = "blobs";
        this.currentBlobName = blobName;
        url = url + "&b=" + blobName;
        url = url + "&d=true";

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            dataType: 'json',
            success: function (data, status, xhr) {
                self.blobCollection = data;
            }
        });

        return self;
    },


    //*******************
    //*                 *
    //*    B Y T E S    *
    //*                 *
    //*******************
    // bytes(value) .......... set blob to byte array
    // bytes() ............... get blob as byte array

    bytes = function (data) {
        var self = this;

        this.dataType = "bytes";
        this.blobValueText = null;
        this.blobValueBytes = [];

        if (arguments.length == 0) /* get */ {

            var url = "/api/blob/bytes/?c=" + this.currentContainerName + "&b=" + this.currentBlobName;

            var binaryBlob = {
                containerName: this.currentContainerName,
                blobName: this.currentBlobName,
                bytes: []
            };

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueBytes = data.bytesEncoded;
                }
            });

            return self.blobValueBytes;
        }
        else /* set */ {

            var url = "/api/blob/bytes/";

            var payload = {
                containerName: this.currentContainerName,
                blobName: this.currentBlobName,
                bytesEncoded: Base64.e(data)
            };

            $.ajax({
                type: 'POST',
                url: url,
                async: false,
                data: payload,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueBytes = data;
                }
            });

            return self;
        }
    },


    //***************************
    //*                         *
    //*    C O N T A I N E R    *
    //*                         *
    //***************************
    // selects a single container

    container = function (containerName) {

        var self = this;

        this.focus = "container";
        this.currentContainerName = containerName;

        return self;
    },


    //*****************************
    //*                           *
    //*    C O N T A I N E R S    *
    //*                           *
    //*****************************
    // Return a list of containers.

    containers = function (/* containerName, 'container-list' or container-list */) {

        var args = Array.prototype.slice.call(arguments);
        var containerName = args.join(',');
        if (args.length === 0) containerName = '';

        var url = "/api/blob/containers/";
        url = url + "?c=" + containerName;

        var self = this;

        this.focus = "containers";
        
        this.currentContainerName = containerName;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            dataType: 'json',
            success: function (data, status, xhr) {
                if (data) {
                    for (var c = 0; c < data.length; c++) {
                        data[c].create = function () { createContainer(this.name); };
                        data[c].remove = function () { removeContainer(this.name); };
                    }
                }
                self.containerCollection = data;
            }
        });

        return self;
    },


    //*****************
    //*               *
    //*    C O P Y    *
    //*               *
    //*****************
    // copy current selection.

    copy = function () {

        var success = false;
        var copySucceeded = 0;
        var copyFailed = 0;
        var sourceContainer = '';
        var destContainer = '';
        var destBlob = '';

        switch (this.focus) {
            case "container":
                if (arguments.length > 0) {
                    sourceContainer = this.currentContainerName;
                    destContainer = arguments[0];
                }
                if (copyContainer(sourceContainer, destContainer)) {
                    copySucceeded++;
                }
                else {
                    copyFailed++;
                }
            case "containers":
                if (arguments.length > 0) {
                    destContainer = arguments[0];
                }
                if (this.containerCollection) {
                    for (var c = 0; c < this.containerCollection.length; c++) {
                        if (copyContainer(this.containerCollection[c].name, destContainer)) {
                            copySucceeded++;
                        }
                        else {
                            copyFailed++;
                        }
                    }
                }
                break;
            case "blob":
                if (arguments.length > 0) {
                    destBlob = arguments[0];
                }
                if (copyBlob(this.currentContainerName, this.currentBlobName, destContainer, destBlob)) {
                    copySucceeded++;
                }
                else {
                    copyFailed++;
                }
                break;
            case "blobs":
                if (arguments.length > 0) {
                    destBlob = arguments[0];
                }
                if (this.blobCollection) {
                    for (var b = 0; b < this.blobCollection.length; b++) {
                        if (copyBlob(this.currentContainerName, this.blobCollection[b].name, destContainer, destBlob)) {
                            copySucceeded++;
                        }
                        else {
                            copyFailed++;
                        }
                    }
                }
                break;
        }

        if (copySucceeded > 0 && copyFailed === 0) {
            success = true;
        }

        return success;
    },


    //*************************************
    //*                                   *
    //*    C O P Y   C O N T A I N E R    *
    //*                                   *
    //*************************************
    // Copy a container.

    copyContainer = function (containerName, destContainerName) {

        var url = "/api/blob/copy/?s=" + aq.storageOptions.storageAccountName + "&c1=" + containerName + "&c2=" + destContainerName;

        var success = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },


    //***************************
    //*                         *
    //*    C O P Y   B L O B    *
    //*                         *
    //***************************
    // copy a blob.

    copyBlob = function (containerName, blobName, destContainerName, destBlobName) {

        var url = "/api/blob/copy/?s=" + aq.storageOptions.storageAccountName + "&c1=" + containerName + "&c2=" + destContainerName + "&b1=" + blobName + "&b2=" + destBlobName;

        var success = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },
    


    //*********************
    //*                   *
    //*    C R E A T E    *
    //*                   *
    //*********************
    // create current selection.

    create = function () {

        var success = false;
        var createSucceeded = 0;
        var createFailed = 0;

        switch (this.focus) {
            case "container":
                if (createContainer(this.currentContainerName)) {
                    createSucceeded++;
                }
                else {
                    createFailed++;
                }
            case "containers":
                if (this.containerCollection) {
                    for (var c = 0; c < this.containerCollection.length; c++) {
                        if (createContainer(this.containerCollection[c].name)) {
                            createSucceeded++;
                        }
                        else {
                            createFailed++;
                        }
                    }
                }
                break;
            case "blob":
                if (createBlob(this.currentContainerName, this.currentBlobName)) {
                    createSucceeded++;
                }
                else {
                    createFailed++;
                }
                break;
            case "blobs":
                if (this.blobCollection) {
                    for (var b = 0; b < this.blobCollection.length; b++) {
                        if (createBlob(this.currentContainerName, this.blobCollection[b].name)) {
                            createSucceeded++;
                        }
                        else {
                            createFailed++;
                        }
                    }
                }
                break;
        }

        if (createSucceeded > 0 && createFailed === 0) {
            success = true;
        }

        return success;
    },


    //*****************************************
    //*                                       *
    //*    C R E A T E   C O N T A I N E R    *
    //*                                       *
    //*****************************************
    // create a container.

    createContainer = function (containerName) {

        var url = "/api/blob/container/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&a=c";

        var success = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },


    //*******************************
    //*                             *
    //*    C R E A T E   B L O B    *
    //*                             *
    //*******************************
    // create an empty blob.

    createBlob = function (containerName, blobName) {

        var url = "/api/blob/blob/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&b=" + blobName + "&a=c";

        var success = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },

    //*********************
    //*                   *
    //*    E X I S T S    *
    //*                   *
    //*********************
    // check whether an artifact exists.

    exists = function () {

        var exists = false,
            existsCount = 0,
            doesNotExistCount = 0;

        switch (this.focus) {
            case "container":
                if (this.containerCollection) {
                    if (existsContainer(this.currentContainerName)) {
                        existsCount++;
                    }
                }
                break;
            case "containers":
                if (this.containerCollection) {
                    for (var c = 0; c < this.containerCollection.length; c++) {
                        if (existsContainer(this.containerCollection[c].name)) {
                            existsCount++;
                        }
                        else {
                            doesNotExistCount++;
                        }
                    }
                }
                break;
            case "blob":
                if (this.containerCollection) {
                    if (existsBlob(this.currentContainerName, this.currentBlobName)) {
                        existsCount++;
                    }
                }
                break;
            case "blobs":
                if (this.blobCollection) {
                    for (var b = 0; b < this.blobCollection.length; b++) {
                        if (existsBlob(this.blobCollection[b].containerName, this.blobCollection[b].name)) {
                            existsCount++;
                        }
                        else {
                            doesNotExistCount++;
                        }
                    }
                }
                break;
        }

        if (existsCount > 0 && doesNotExistCount === 0) {
            exists = true;
        }

        return exists;
    },


    //*****************************************
    //*                                       *
    //*    E X I S T S   C O N T A I N E R    *
    //*                                       *
    //*****************************************
    // create whether a container exists.

    existsContainer = function (containerName) {

        var url = "/api/blob/container/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&a=x";

        var exists = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                exists = data;
            }
        });

        return exists;
    },


    //*******************************
    //*                             *
    //*    E X I S T S   B L O B    *
    //*                             *
    //*******************************
    // check whether a blob exists.

    existsBlob = function (containerName, blobName) {

        var url = "/api/blob/blob/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&b=" + blobName + "&a=x";

        var exists = false;

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            data: null,
            dataType: 'json',
            success: function (data, status, xhr) {
                exists = data;
            }
        });

        return exists;
    },


    //*****************
    //*               *
    //*    E A C H    *
    //*               *
    //*****************
    // iterates through containers or blobs.

    each = function (func) {

        var container;
        var blob;
        var self = this;

        if (this.focus === "containers") {
            for (var b = 0; b < self.containerCollection.length; b++) {
                container = self.containerCollection[b];
                func(container);
            }
        }
        else if (this.focus === "container") {
            container = { name: self.currentContainerName };
            func(container);
        }
        else if (this.focus === "blobs") {
            for (var b = 0; b < self.blobCollection.length; b++) {
                blob = self.blobCollection[b];
                func(blob);
            }
        }
        else if (this.focus === "blob") {
            blob = { name: self.currentBlobName };
            func(blob);
        }

        return self;
    },


    //*********************
    //*                   *
    //*    R E M O V E    *
    //*                   *
    //*********************
    // remove current seletion.

    remove = function () {

        if (!aq.storageOptions.allowDeletes) throw('Cannot delete - delete permission has not been set');

        var success = false;
        var removedSucceeded = 0;
        var removedFailed = 0;

        switch (this.focus) {
            case "container":
                if (removeContainer(this.currentContainerName)) {
                    removedSucceeded++;
                }
                else {
                    removedFailed++;
                }
                break;
            case "containers":
                if (this.containerCollection) {
                    for (var c = 0; c < this.containerCollection.length; c++) {
                        if (removeContainer(this.containerCollection[c].name)) {
                            removedSucceeded++;
                        }
                        else {
                            removedFailed++;
                        }
                    }
                }
                break;
            case "blob":
                if (removeBlob(this.currentContainerName, this.currentBlobName)) {
                    removedSucceeded++;
                }
                else {
                    removedFailed++;
                }
                break;
            case "blobs":
                if (this.blobCollection) {
                    for (var b = 0; b < this.blobCollection.length; b++) {
                        if (removeBlob(this.currentContainerName, this.blobCollection[b].name)) {
                            removedSucceeded++;
                        }
                        else {
                            removedFailed++;
                        }
                    }
                }
                break;
        }

        if (removedSucceeded > 0 && removedFailed === 0) {
            success = true;
        }

        return success;
    },


    //*****************************************
    //*                                       *
    //*    R E M O V E   C O N T A I N E R    *
    //*                                       *
    //*****************************************
    // remove a container.

    removeContainer = function (containerName) {

        if (!aq.storageOptions.allowDeletes) return;

        var success = false;

        var url = "/api/blob/container/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&a=r";

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },


    //*******************************
    //*                             *
    //*    R E M O V E   B L O B    *
    //*                             *
    //*******************************
    // remove a blob.

    removeBlob = function (containerName, blobName) {

        if (!aq.storageOptions.allowDeletes) return;

        var success = false;

        var url = "/api/blob/blob/?s=" + aq.storageOptions.storageAccountName + "&c=" + containerName + "&b=" + blobName + "&a=r";

        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            dataType: 'json',
            success: function (data, status, xhr) {
                success = data;
            }
        });

        return success;
    },


    //********************
    //*                  *
    //*    T  E  X  T    *
    //*                  *
    //********************
    // text(value) .......... set blob to text
    // text() ............... get blob as text

    text = function (data) {
        var self = this;

        this.dataType = "text";
        this.blobValueText = null;
        this.blobValueBytes = [];

        if (arguments.length == 0) /* get */ {

            if (this.focus === "blobs") {
                if (!this.blobCollection || this.blobCollection.length === 0) return this;
                this.currentBlobName = this.blobCollection[0].name;
            }

            var url = "/api/blob/text/?c=" + this.currentContainerName + "&b=" + this.currentBlobName;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueText = data;
                }
            });

            return self.blobValueText;
        }
        else /* set */ {

            var url = "/api/blob/text/?c=" + this.currentContainerName + "&b=" + this.currentBlobName;

            var payload = {
                containerName: this.currentContainerName,
                blobName: this.currentBlobName,
                text: data
            };

            $.ajax({
                type: 'POST',
                url: url,
                async: false,
                data: payload,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueText = data;
                }
            });

            return self;
        }
    }

        //********************
        //*                  *
        //*    J  S  O  N    *
        //*                  *
        //********************
        // json(obj) ............. set blob to text of object-as-JSON
        // json() ............... get blob as object

    json = function (obj) {
        var self = this;

        this.dataType = "text";
        this.blobValueText = null;
        this.blobValueBytes = [];

        if (arguments.length == 0) /* get */ {

            if (this.focus === "blobs") {
                if (!this.blobCollection || this.blobCollection.length === 0) return this;
                this.currentBlobName = this.blobCollection[0].name;
            }

            var url = "/api/blob/text/?c=" + this.currentContainerName + "&b=" + this.currentBlobName;

            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueText = data;
                }
            });

            return JSON.parse(self.blobValueText);
        }
        else /* set */ {

            var url = "/api/blob/text/?c=" + this.currentContainerName + "&b=" + this.currentBlobName;

            var payload = {
                containerName: this.currentContainerName,
                blobName: this.currentBlobName,
                text: JSON.stringify(obj)
            };

            $.ajax({
                type: 'POST',
                url: url,
                async: false,
                data: payload,
                dataType: 'json',
                success: function (data, status, xhr) {
                    self.blobValueText = data;
                }
            });

            return self;
        }
    }
    
    return {
        containers: containers,
        blobs: blobs,
        each: each,
        container: container,
        blob: blob,
        text: text,
        bytes: bytes,
        json: json,
        create: create,
        remove: remove,
        exists: exists,
        copy: copy
    };
}();



// AzureQuery base object.

var azureQuery = function () {

    var storage = function (storageAccountName) {
        if (!storageAccountName) storageAccountName = '';
        return new azureQueryStorage(storageAccountName);
    }

    return {
        storage: storage,
        storageOptions: {
            storageAccountName: '',
            allowDeletes: false
        }
    };
}

aq = azureQuery();
