
var storageAcct = '';       // storage account name, or empty string for 'default'.


// write results to div named 'output'

function write(message) {
    document.getElementById('output').innerHTML += message + "<br>";
}


$(document).ready(function () {
    // Perform initialization here
});


function checkAllowDeletes() {
    if ($('#allowDeletes').attr('checked')?true:false) {
        aq.storageOptions.allowDeletes = true;
    }
    else {
        aq.storageOptions.allowDeletes = false;
    }
}

function listContainers() {

    var containerSelection = $('#containerSelection').val();

    $('#containerList').html('');
    aq.storage(storageAcct).containers(containerSelection).each(function (container) {
        $('#containerList').append(container.name + '<br/>');
    });
}

function createContainer() {

    var containerSelection = $('#containerSelection').val();

    if (!containerSelection) {
        alert("Please enter a container name");
        return;
    }

    aq.storage(storageAcct).containers(containerSelection).create();
    alert('Done');
}

function removeContainers() {

    try {
        var containerName = $('#containerSelection').val();
        aq.storage(storageAcct).containers(containerName).remove();
        alert('Done');
    }
    catch (e) {
        alert("EXCEPTION\n\n" + e)
    }
}


function listBlobs() {

    $('#blobList').html('');

    var containerName = $('#containerName').val();
    var blobsFilter = $('#blobsFilter').val();

    aq.storage(storageAcct).container(containerName).blobs(blobsFilter).each(function (blob) {
        $('#blobList').append(blob.name + " (" + blob.length + ") " + blob.blobType + '<br/>');
    });
}

function createBlob() {

    var containerSelection = $('#containerName').val();
    var blobSelection = $('#blobsFilter').val();

    aq.storage(storageAcct).containers(containerSelection).blobs(blobSelection).create();
    alert('Done');
}

function removeBlob() {

    try {
        var containerSelection = $('#containerName').val();
        var blobSelection = $('#blobsFilter').val();

        aq.storage(storageAcct).containers(containerSelection).blobs(blobSelection).remove();
        alert('Done');
    }
    catch (e) {
        alert("EXCEPTION\n\n" + e)
    }
}

function getBlobText() {

    var containerName = $('#textContainerName').val();
    var blobName = $('#textBlobName').val();
    
    $('#blobText').text('');

    //var text = aq.storage(storageAcct).container(containerName).blob(blobName).text();
    //var text = aq.storage(storageAcct).container(containerName).blobs(blobName).text();
    var text = aq.storage(storageAcct).containers(containerName).blobs(blobName).text();
    $('#blobText').text(text);
}

function getBlobBytes() {

    var containerName = $('#bytesContainerName').val();
    var blobName = $('#bytesBlobName').val();

    $('#blobBytes').text('');

    //var bytes = aq.storage(storageAcct).containers(containerName).blobs(blobName).bytes();
    var bytes = aq.storage(storageAcct).containers(containerName).blobs(blobName).bytes();

    var reader = new Base64Reader(bytes);
    var b = reader.readByte();
    var s = '';
    while (b !== -1) {
        s = s + b.toString() + ' ';
        b = reader.readByte();
    }

    $('#blobBytes').text(s);
}

function getBlobJson() {

    var containerName = $('#jsonContainerName').val();
    var blobName = $('#jsonBlobName').val();

    $('#blobJson').text('');

    var obj = aq.storage(storageAcct).container(containerName).blob(blobName).json();
    var text = "";
    if (obj) {
        text = JSON.stringify(obj);
    }

    $('#blobJson').text(text);
}

function putBlobText() {

    var containerName = $('#textContainerName').val();
    var blobName = $('#textBlobName').val();
    var blobText = $('#blobText').text();

    aq.storage(storageAcct).container(containerName).blob(blobName).text(blobText);

    alert('done');
}

function putBlobJson() {

    var containerName = $('#jsonContainerName').val();
    var blobName = $('#jsonBlobName').val();
    var blobText = $('#blobJson').text();
    var obj = JSON.parse(blobText);

    aq.storage(storageAcct).container(containerName).blob(blobName).json(obj);

    alert('done');
}

function putBlobBytes() {

    var containerName = $('#bytesContainerName').val();
    var blobName = $('#bytesBlobName').val();
    var blobText = $('#blobBytes').text();

    var values = blobText.split(' ');

    if (values.length > 0) {
        for (var v = 0; v < values.length; v++) {
            values[v] = parseInt(values[v], 10);
        }
    }

    aq.storage(storageAcct).blob(containerName, blobName).bytes(values);

    alert('done');
}