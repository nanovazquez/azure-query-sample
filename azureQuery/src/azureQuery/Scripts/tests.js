
function newId() {
    var date = new Date();
    return date.getTime().toString();
}

function runAzureQueryUnitTests() {

    var containerA = newId() + "a";
    var containerB = newId() + "b";
    var containerC = newId() + "c";
    var containerD = newId() + "d";
    var containerE = newId() + "e";
    var containerF = newId() + "f";

    module("S E T U P");

    test("Remove all containers", function () {

        aq.storageOptions.allowDeletes = true;

        aq.storage().containers().remove();
        ok(true, "Test set-up actions");
    });

    test("Create containers", function () {
        aq.storage().container(containerA).create();
        aq.storage().container(containerB).create();
        aq.storage().container(containerC).create();
        ok(true, "Test set-up actions");
    });

    test("Create blobs", function () {
        aq.storage().container(containerA).blob('test1.txt').text('abcdef');
        aq.storage().container(containerA).blob('test2.txt').text('abcdef');

        ok(true, "Test set-up actions");
    });


    module("C O N T A I N E R S");

    // Test that containers(*) returns all containers.
    // The test expects that there are containers named testa, testb, and testc.

    test("wildcard: containers('*') should return 3 test containers", function () {

        var haveTesta = false;
        var haveTestb = false;
        var haveTestc = false;

        aq.storage().containers('*').each(function (container) {
            if (container.name === containerA) {
                haveTesta = true;
            };
            if (container.name === containerB) {
                haveTestb = true;
            };
            if (container.name === containerC) {
                haveTestc = true;
            };
        });

        ok(haveTesta && haveTestb && haveTestc, 'Expected containers returned: testa, testb, testc');
    });


    // Test that containers('test*') returns all test containers.
    // The test expects that there are containers named testa, testb, and testc.

    test("starts-with: containers('test*') should return 3 test containers", function () {

        var haveTesta = false;
        var haveTestb = false;
        var haveTestc = false;

        aq.storage().containers('*').each(function (container) {
            if (container.name === containerA) {
                haveTesta = true;
            };
            if (container.name === containerB) {
                haveTestb = true;
            };
            if (container.name === containerC) {
                haveTestc = true;
            };
        });

        ok(haveTesta && haveTestb && haveTestc, 'Expected containers returned: testa, testb, testc');
    });


    // Test that containers('*st*') returns all test containers.
    // The test expects that there are containers named testa, testb, and testc.

    test("contains: containers('*st*') should return 3 test containers", function () {

        var haveTesta = false;
        var haveTestb = false;
        var haveTestc = false;

        aq.storage().containers('*').each(function (container) {
            if (container.name === containerA) {
                haveTesta = true;
            };
            if (container.name === containerB) {
                haveTestb = true;
            };
            if (container.name === containerC) {
                haveTestc = true;
            };
        });

        ok(haveTesta && haveTestb && haveTestc, 'Expected containers returned: testa, testb, testc');
    });



    // Test that containers('*ta') returns one test containers (testa)
    // The test expects that there are containers named testa, testb, and testc.

    test("ends-with: containers('*ta') should return 1 test container", function () {

        var haveTesta = false;
        var haveTestb = false;
        var haveTestc = false;

        aq.storage().containers('*').each(function (container) {
            if (container.name === containerA) {
                haveTesta = true;
            };
        });

        ok(haveTesta, 'Expected container returned: testa');
    });


    // Test that containers(name1, name2, name3) returns names even if name does not exist.

    test("name list: containers('aaa,bbb,ccc') should return 'aaa', 'bbb', 'ccc'", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;
        var haveBlobName3 = false;

        aq.storage().containers('aaa,bbb,ccc').each(function (container) {
            if (container.name === "aaa") {
                haveBlobName1 = true;
            };
            if (container.name === "bbb") {
                haveBlobName2 = true;
            };
            if (container.name === "ccc") {
                haveBlobName3 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2 && haveBlobName3, 'Expected container names returned');
    });


    // Test that containers(wild1, wild2, wild3) returns names even if name does not exist.

    test("wildcard list: containers('*a,*b,*c') should return 'aaa', 'bbb', 'ccc'", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;
        var haveBlobName3 = false;

        aq.storage().containers('aaa,bbb,ccc').each(function (container) {
            if (container.name === "aaa") {
                haveBlobName1 = true;
            };
            if (container.name === "bbb") {
                haveBlobName2 = true;
            };
            if (container.name === "ccc") {
                haveBlobName3 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2 && haveBlobName3, 'Expected container names returned');
    });


    // Test that containers(wild1, name2, wild3) returns names even if name does not exist.

    test("mixed list: containers('*a,testb,*c') should return 'aaa', 'bbb', 'ccc'", function () {

        var haveContainerName1 = false;
        var haveContainerName2 = false;
        var haveContainerName3 = false;

        aq.storage().containers('aaa,bbb,ccc').each(function (container) {
            if (container.name === "aaa") {
                haveContainerName1 = true;
            };
            if (container.name === "bbb") {
                haveContainerName2 = true;
            };
            if (container.name === "ccc") {
                haveContainerName3 = true;
            };
        });

        ok(haveContainerName1 && haveContainerName2 && haveContainerName3, 'Expected container names returned');
    });



    module("C O N T A I N E R S . C R E A T E");


    // Test containers(name).create()

    test("create: containers(containerD).create() should succeed", function () {

        aq.storage().containers(containerD).create();

        ok(true, "No error");
    });


    // Test container(name).create() (repeat)

    test("create: containers(containerD).create() again should succeed", function () {

        aq.storage().containers(containerD).create();

        ok(true, "No error");
    });

    

    module("C O N T A I N E R S . R E M O V E");


    // Test containers(name).remove() container exists

    test("remove: containers(containerD).remove() should succeed", function () {

        var result = aq.storage().containers(containerD).remove();

        var result2 = !aq.storage().containers(containerD).exists();

        ok(result, "remove returned true");
        ok(result2, "exists returned false");
    });

    // Test containers(name).remove() container does not exist

    test("remove: containers('testz').remove() does not exist should fail", function () {

        var result = !aq.storage().containers('testz').remove();

        ok(result, "true result");
    });


    module("C O N T A I N E R S . C O P Y");


    // Test container copy

    test("copy: containers(container1).copy(container2) should succeed", function () {

        var container = newId();
        var container2 = container + "-copy";

        aq.storage().containers(container).create();

        aq.storage().containers(container).blob('blob1.txt').text('Now is the time for all good men to come to the aid of their party.');

        aq.storage().containers(container).blob('blob2.txt').text('Test');

        aq.storage().containers(container).blob('blob3.dat').bytes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        aq.storage().containers(container).blob('subfolder/blob4.dat').bytes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        // Copy container
        var result = aq.storage().containers(container).copy(container2);

        var result1 = aq.storage().containers(container2).blob('blob1.txt').exists();
        var result2 = aq.storage().containers(container2).blob('blob2.txt').exists();
        var result3 = aq.storage().containers(container2).blob('blob3.dat').exists();
        var result4 = aq.storage().containers(container2).blob('subfolder/blob4.dat').exists();

        ok(result, "copy returned " + result);
        ok(result1, "exists(blob1.txt) returned " + result1);
        ok(result2, "exists(blob2.txt) returned " + result2);
        ok(result3, "exists(blob3.dat) returned " + result3);
        ok(result4, "exists(subfolder/blob4.dat) returned " + result4);
    });


    // Test multi-container copy

    test("copy(multiple): containers(container-list).copy(container2) should succeed", function () {

        var container = newId();
        var container1 = container + "-1";
        var container2 = container + "-2";
        var container3 = container + "-3";
        var containerX = container + "-copy";

        aq.storage().containers(container1).create();

        aq.storage().containers(container1).blob('blob1-1.txt').text('Now is the time for all good men to come to the aid of their party.');

        aq.storage().containers(container1).blob('blob1-2.txt').text('Test!');

        aq.storage().containers(container1).blob('1/blob1-3.dat').bytes([ 1, 1, 1 ]);


        aq.storage().containers(container2).create();

        aq.storage().containers(container2).blob('blob2-1.txt').text('Now is the time for all good men to come to the aid of their party..');

        aq.storage().containers(container2).blob('blob2-2.txt').text('Test!!');

        aq.storage().containers(container2).blob('2/blob2-3.dat').bytes([2, 2, 2, 2]);


        aq.storage().containers(container3).create();

        aq.storage().containers(container3).blob('blob3-1.txt').text('Now is the time for all good men to come to the aid of their party...');

        aq.storage().containers(container3).blob('blob3-2.txt').text('Test!!!');

        aq.storage().containers(container3).blob('3/blob3-3.dat').bytes([3, 3, 3, 3, 3]);



        // Copy containers
        var result = aq.storage().containers(container1, container2, container3).copy(containerX);

        var result1 = aq.storage().containers(containerX).blob('blob1-1.txt').exists();
        var result2 = aq.storage().containers(containerX).blob('blob1-2.txt').exists();
        var result3 = aq.storage().containers(containerX).blob('1/blob1-3.dat').exists();

        var result4 = aq.storage().containers(containerX).blob('blob2-1.txt').exists();
        var result5 = aq.storage().containers(containerX).blob('blob2-2.txt').exists();
        var result6 = aq.storage().containers(containerX).blob('2/blob2-3.dat').exists();

        var result7 = aq.storage().containers(containerX).blob('blob3-1.txt').exists();
        var result8 = aq.storage().containers(containerX).blob('blob3-2.txt').exists();
        var result9 = aq.storage().containers(containerX).blob('3/blob3-3.dat').exists();

        ok(result, "copy returned " + result);

        ok(result1, "exists(blob1-1.txt) returned " + result1);
        ok(result2, "exists(blob1-2.txt) returned " + result2);
        ok(result3, "exists(1/blob1-3.dat) returned " + result3);

        ok(result4, "exists(blob2-1.txt) returned " + result4);
        ok(result5, "exists(blob2-2.txt) returned " + result5);
        ok(result6, "exists(2/blob2-3.dat) returned " + result6);

        ok(result7, "exists(blob3-1.txt) returned " + result7);
        ok(result8, "exists(blob3-2.txt) returned " + result8);
        ok(result9, "exists(3/blob3-3.dat) returned " + result9);
    });




    module("C O N T A I N E R S . B L O B S");


    // Test containers(name).blobs()

    test("wildcard: containers(containerA).blobs() should return existing blobs", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blobs().each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });


    // Test containers(name).blobs(name)

    test("name: containers(containerA).blobs('text1.txt') should return specified blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blobs('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });


    // Test containers(name).blobs(*name)

    test("ends-with: containers(containerA).blobs('*1.txt') should return matching blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blobs('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });



    // Test containers(name).blobs(name*)

    test("ends-with: containers(containerA).blobs('test*') should return matching blobs only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blobs('test*').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });


    // Test containers(name).blobs(*name*)

    test("contains: containers(containerA).blobs('*t*') should return matching blobs only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blobs('*t*').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });


    module("C O N T A I N E R S . B L O B S . C R E A T E");


    // Test containers(name).blobs(name).create()

    test("create-remove: containers(containerD).blobs('blob1').create() should succeed", function () {

        var container = newId();

        var result = aq.storage().containers(container).blobs('blob1').create();

        var result2 = aq.storage().containers(container).blobs('blob1').exists();

        ok(result, "created returned " + result);
        ok(result2, "exists returned " + result2);

       // Test containers(name).blobs(name).create() (repeat)

        result = aq.storage().containers(container).blobs('blob1').create();

        result2 = aq.storage().containers(container).blobs('blob1').exists();

        ok(result, "created(2) returned " + result);
        ok(result2, "exists(2) returned " + result2);
    });


    module("C O N T A I N E R S . B L O B S . R E M O V E");


    // Test containers(name).blobs(name).remove()

    test("remove: containers('containersblobsremove').blobs('blob1').remove() should succeed", function () {

        aq.storage().containers('containersblobsremove').blobs('blob1').remove();

        var result = aq.storage().containers('containersblobsremove').blobs('blob1').remove();

        var result2 = aq.storage().containers('containersblobsremove').blobs('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });


    // Test containers(name).blobs(name).remove() (repeat)

    test("remove(2): containers('containersblobsremove').blobs('blob1').remove() again should succeed", function () {

        var result = aq.storage().containers('containersblobsremove').blobs('blob1').remove();

        var result2 = aq.storage().containers('containersblobsremove').blobs('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });



    module("C O N T A I N E R S . B L O B");


    // Test containers(name).blob(name)

    test("name: containers(containerA).blob('text1.txt') should return specified blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().containers(containerA).blob('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });


    module("C O N T A I N E R S . B L O B . C R E A T E");


    // Test containers(name).blob(name).create()

    test("createX: containers(containerD).blob('blob1').create() should succeed", function () {

        var container = newId();

        var result = aq.storage().containers(container).blob('blob1').create();

        var result2 = aq.storage().containers(container).blob('blob1').exists();

        ok(result, "created returned " + result);
        ok(result2, "exists returned " + result2);
    });


    // Test containers(name).blob(name).create() (repeat)

    test("create: containers(containerD).blob('blob1').create() again should succeed", function () {

        var result = aq.storage().containers(containerA).blob('blob1').create();

        var result2 = aq.storage().containers(containerA).blob('blob1').exists();

        ok(result, "created returned true");
        ok(result2, "exists returned true");
    });


    module("C O N T A I N E R S . B L O B . R E M O V E");


    // Test containers(name).blob(name).remove()

    test("remove: containers('containersblobremove').blob('blob1').remove() should succeed", function () {

        aq.storage().containers('containersblobremove').blob('blob1').remove();

        var result = aq.storage().containers('containersblobremove').blob('blob1').remove();

        var result2 = aq.storage().containers('containersblobremove').blob('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });


    // Test containers(name).blob(name).remove() (repeat)

    test("remove(2): containers('containersblobremove').blob('blob1').remove() again should succeed", function () {

        var result = aq.storage().containers('containersblobremove').blob('blob1').remove();

        var result2 = aq.storage().containers('containersblobremove').blob('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });



    //------------------ CONTAINER ----------------


    module("C O N T A I N E R");


    // Test that container(name) returns name even if name does not exist.

    test("name: container('xyz') should return 'xyz'", function () {

        var haveContainerName = false;

        aq.storage().containers('xyz').each(function (container) {
            if (container.name === "xyz") {
                haveContainerName = true;
            };
        });

        ok(haveContainerName, "Expected container name 'xyz' returned");
    });





    module("C O N T A I N E R . E X I S T S");


    // Test container(name).exists()

    test("exists: container(containerA).exists() on existing container should return true", function () {

        var success = aq.storage().container(containerA).exists();

        ok(success, "True result");
    });



    // Test container(does-not-exist-name).exists()

    test("!exists: container('testz').exists() on non-existant container should return false", function () {

        var success = !aq.storage().container('testz').exists();

        ok(success, "True result");
    });



    module("C O N T A I N E R . C R E A T E");


    // Test container(name).create()

    test("create: container('teste').create() should succeed", function () {

        var result = aq.storage().container(containerE).create();

        var result2 = aq.storage().container(containerE).exists();

        ok(result, "create returned " + result);
        ok(result, "exists returned " + result2);
    });


    // Test container(name).create() (repeat)

    test("create: container('teste').create() again should succeed", function () {

        aq.storage().container(containerE).create();

        ok(true, "No error");
    });


    module("C O N T A I N E R . R E M O V E");


    // Test container(name).remove() container exists

    test("remove: container(containerE).remove() should succeed", function () {

        aq.storageOptions.allowDeletes = true;

        var result = aq.storage().container(containerE).remove();

        ok(result, "true result");
    });

    // Test container(name).remove() container does not exist

    test("remove: container('testz').remove() does not exist should fail", function () {

        var result = !aq.storage().container('testz').remove();

        ok(result, "true result");
    });



    module("C O N T A I N E R . C O P Y");


    // Test container copy

    test("copy: container(container1).copy(container2) should succeed", function () {

        var container = newId();
        var container2 = container + "-copy";

        aq.storage().container(container).create();

        aq.storage().container(container).blob('blob1.txt').text('Now is the time for all good men to come to the aid of their party.');

        aq.storage().container(container).blob('blob2.txt').text('Test');

        aq.storage().container(container).blob('blob3.dat').bytes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        aq.storage().container(container).blob('subfolder/blob4.dat').bytes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        // Copy container
        var result = aq.storage().container(container).copy(container2);

        var result1 = aq.storage().container(container2).blob('blob1.txt').exists();
        var result2 = aq.storage().container(container2).blob('blob2.txt').exists();
        var result3 = aq.storage().container(container2).blob('blob3.dat').exists();
        var result4 = aq.storage().container(container2).blob('subfolder/blob4.dat').exists();

        ok(result, "copy returned " + result);
        ok(result1, "exists(blob1.txt) returned " + result1);
        ok(result2, "exists(blob2.txt) returned " + result2);
        ok(result3, "exists(blob3.dat) returned " + result3);
        ok(result4, "exists(subfolder/blob4.dat) returned " + result4);
    });







    module("C O N T A I N E R . B L O B S");


    // Test container(name).blobs()

    test("wildcard: container(containerA).blobs() should return existing blobs", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerA).blobs().each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });


    // Test container(name).blobs(name)

    test("name: container(containerA).blobs('text1.txt') should return specified blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerA).blobs('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });


    // Test container(name).blobs(*name)

    test("ends-with: container(containerA).blobs('*1.txt') should return matching blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerA).blobs('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });



    // Test container(name).blobs(name*)

    test("ends-with: container(containerA).blobs('test*') should return matching blobs only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerA).blobs('test*').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });


    // Test container(name).blobs(*name*)

    test("contains: container(containerA).blobs('*t*') should return matching blobs only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerA).blobs('*t*').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && haveBlobName2, "Expected blobs returned");
    });



    module("C O N T A I N E R . B L O B S . C R E A T E");


    // Test container(name).blobs(name).create()

    test("create: container(containerD).blobs('blob1').create() should succeed", function () {

        var result = aq.storage().container(containerA).blobs('blob1').create();

        var result2 = aq.storage().container(containerA).blobs('blob1').exists();

        ok(result, "created returned true");
        ok(result2, "exists returned true");
    });


    // Test container(name).blobs(name).create() (repeat)

    test("create: container(containerD).blobs('blob1').create() again should succeed", function () {

        var result = aq.storage().container(containerA).blobs('blob1').create();

        var result2 = aq.storage().container(containerA).blobs('blob1').exists();

        ok(result, "created returned true");
        ok(result2, "exists returned true");
    });


    module("C O N T A I N E R . B L O B S . R E M O V E");


    // Test container(name).blobs(name).remove()

    test("remove: containers('containerblobsremove').blobs('blob1').remove() should succeed", function () {

        aq.storage().container('containerblobsremove').blobs('blob1').remove();

        var result = aq.storage().container('containerblobsremove').blobs('blob1').remove();

        var result2 = aq.storage().container('containerblobsremove').blobs('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });


    // Test container(name).blobs(name).remove() (repeat)

    test("remove(2): container('containerblobsremove').blob('blob1').remove() again should succeed", function () {

        var result = aq.storage().container('containerblobsremove').blobs('blob1').remove();

        var result2 = aq.storage().container('containerblobsremove').blobs('blob1').exists();

        ok(result, "removed returned " + result);
        ok(!result2, "exists returned " + result2);
    });



    module("C O N T A I N E R . B L O B");


    // Test container(name).blob(name)

    test("name: container(containerD).blob('text1.txt') should return specified blob only", function () {

        var haveBlobName1 = false;
        var haveBlobName2 = false;

        aq.storage().container(containerD).blob('test1.txt').each(function (blob) {
            if (blob.name === "test1.txt") {
                haveBlobName1 = true;
            };
            if (blob.name === "test2.txt") {
                haveBlobName2 = true;
            };
        });

        ok(haveBlobName1 && !haveBlobName2, "Expected blobs returned");
    });


    module("C O N T A I N E R . B L O B . C R E A T E");


    // Test container(name).blob(name).create()

    test("create: container(containerF).blob('blob1').create() should succeed", function () {

        var result = aq.storage().container(containerF).blob('blob1').create();

        var result2 = aq.storage().container(containerF).blob('blob1').exists();

        ok(result, "created returned " + result);
        ok(result2, "exists returned " + result2);
    });


    // Test container(name).blob(name).create() (repeat)

    test("create: container(containerF).blob('blob1').create() again should succeed", function () {

        var result = aq.storage().container(containerF).blob('blob1').create();

        var result2 = aq.storage().container(containerF).blob('blob1').exists();

        ok(result, "created returned " + result);
        ok(result2, "exists returned " + result2);
    });


    module("C O N T A I N E R . B L O B . C O P Y");


    // Test container(name).blob(name).copy()

    test("copy: container(containerF).blob('blob1').copy() should succeed", function () {

        var result = aq.storage().container(containerF).blob('blob1').copy('blob2');

        var result2 = aq.storage().container(containerF).blob('blob2').exists();

        ok(result, "copy returned " + result);
        ok(result2, "exists returned " + result2);
    });


    module("C O N T A I N E R . B L O B . R E M O V E");


    // Test container(name).blob(name).remove()

    test("remove: container('containerblobremove').blob('blob1').remove() should succeed", function () {

        aq.storage().container('containerblobremove').blob('blob1').remove();

        var result = aq.storage().container('containerblobremove').blob('blob1').remove();

        var result2 = !aq.storage().container('containerblobremove').blob('blob1').exists();

        ok(result, "removed returned " + result);
        ok(result2, "exists returned " + result2);
    });


    // Test container(name).blob(name).remove() (repeat)

    test("remove(2): container('containerblobremove').blob('blob1').remove() again should succeed", function () {

        var result = aq.storage().container('containerblobremove').blob('blob1').remove();

        var result2 = !aq.storage().container('containerblobremove').blob('blob1').exists();

        ok(result, "removed returned " + result);
        ok(result2, "exists returned " + result2);
    });

    

    module("T E X T");


    test("containers/blobs/text: containers(name).blobs(name).text(value)", function () {

        var value1 = "Now is the time for all good men to come to the aid of their party.";

        aq.storage().containers(containerB).blobs('blob1.txt').text(value1);

        var value2 = aq.storage().containers(containerB).blobs('blob1.txt').text();

        ok(value1 === value2, "Blob text written confirmed in read back");
    });


    test("containers/blobs/text: containers(name).blobs(name).text(value)", function () {

        var value1 = "Now is the time for all good men to come to the aid of their party.";

        aq.storage().containers(containerB).blobs('blob1.txt').text(value1);

        var value2 = aq.storage().containers(containerB).blobs('blob1.txt').text();

        ok(value1 === value2, "Blob text written confirmed in read back");
    });

    test("containers/blob/text: containers(name).blobs(name).text(value)", function () {

        var value1 = "Now is the time for all good men to come to the aid of their party.";

        aq.storage().containers(containerB).blob('blob2.txt').text(value1);

        var value2 = aq.storage().containers(containerB).blob('blob2.txt').text();

        ok(value1 === value2, "Blob text written confirmed in read back");
    });


    test("container/blobs/text: container(name).blobs(name).text(value)", function () {

        var value1 = "Now is the time for all good men to come to the aid of their party.";

        aq.storage().container(containerB).blobs('blob3.txt').text(value1);

        var value2 = aq.storage().container(containerB).blobs('blob3.txt').text();

        ok(value1 === value2, "Blob text written confirmed in read back");
    });

    test("container/blob/text: container(name).blob(name).text(value)", function () {

        var value1 = "Now is the time for all good men to come to the aid of their party.";

        aq.storage().container(containerB).blob('blob4.txt').text(value1);

        var value2 = aq.storage().container(containerB).blob('blob4.txt').text();

        ok(value1 === value2, "Blob text written confirmed in read back");
    });


    module("B Y T E S");


    test("containers/blobs/bytes: containers(name).blobs(name).bytes(value)", function () {

        var value1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        aq.storage().containers(containerB).blobs('blob1.dat').bytes(value1);

        var bytes = aq.storage().containers(containerB).blobs('blob1.dat').bytes();

        var value2 = [];
        var reader = new Base64Reader(bytes);
        var b = reader.readByte();
        var s = '';
        while (b !== -1) {
            value2.push(b);
            b = reader.readByte();
        }

        ok(arraysEqual(value1, value2), "Blob bytes written confirmed in read back");
    });


    test("containers/blob/bytes: containers(name).blob(name).bytes(value)", function () {

        var value1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        aq.storage().containers(containerB).blob('blob1.dat').bytes(value1);

        var bytes = aq.storage().containers(containerB).blob('blob1.dat').bytes();

        var value2 = [];
        var reader = new Base64Reader(bytes);
        var b = reader.readByte();
        var s = '';
        while (b !== -1) {
            value2.push(b);
            b = reader.readByte();
        }

        ok(arraysEqual(value1, value2), "Blob bytes written confirmed in read back");
    });


    test("container/blobs/bytes: container(name).blobs(name).bytes(value)", function () {

        var value1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        aq.storage().container(containerB).blobs('blob1.dat').bytes(value1);

        var bytes = aq.storage().container(containerB).blobs('blob1.dat').bytes();

        var value2 = [];
        var reader = new Base64Reader(bytes);
        var b = reader.readByte();
        var s = '';
        while (b !== -1) {
            value2.push(b);
            b = reader.readByte();
        }

        ok(arraysEqual(value1, value2), "Blob bytes written confirmed in read back");
    });


    test("container/blob/bytes: container(name).blob(name).bytes(value)", function () {

        var value1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        aq.storage().container(containerB).blobs('blob1.dat').bytes(value1);

        var bytes = aq.storage().container(containerB).blob('blob1.dat').bytes();

        var value2 = [];
        var reader = new Base64Reader(bytes);
        var b = reader.readByte();
        var s = '';
        while (b !== -1) {
            value2.push(b);
            b = reader.readByte();
        }

        ok(arraysEqual(value1, value2), "Blob bytes written confirmed in read back");
    });




    //Compare two arrays for equality.

    function arraysEqual(value1, value2) {
        var same = false;
        if (value1.length == value2.length) {
            same = true;
            for (var v = 0; v < value1.length; v++) {
                if (value1[v] !== value2[v]) {
                    same = false;
                }
            }
        }
        return same;
    }
}