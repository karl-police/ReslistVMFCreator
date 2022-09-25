// Module definition
/*const ReslistVMF_Module = new function() {
//

function entityStringCreator(contentTable) {
    const entityTable = {}

    Object.assign(entityTable, contentTable)

    var stringifiedTableForVMF = JSON2_modified.stringify(entityTable, null, 4, {
        separator: "",
        //bSeparatorGap: true,
        joinChar: "",
        joinNewlineChar: ""
    })

    return "entity " + stringifiedTableForVMF // Add "entity" infront of the table start {}
}



function brushStringCreator(contentTable) {
    var startingContent =
    `world
    {
    
    `; // reminder that 1 bracket at the end is needed
}


function createVMFfromReslist(fileContent) {
    let finalResult = "";

    // The reslist file has every resource in a new line.
    var resArray = fileContent.split("\n");

    var mdlArray = [];
    var materialArray = [];

    var entityStringCollection = "";
    var materialStringCollection = "";

    // loop over every item in the array, check if it contains something certain
    for (var i=0; i < resArray.length; i++) {
        // Remove the line breaks for this case.
        resArray[i] = resArray[i].replace(/(\r\n|\n|\r)/gm, "");

        // .mdl
        if (resArray[i].endsWith(".mdl\"")*/ /*&& !resArray[i].includes("humans\\") && !resArray[i].includes("gibs\\")*/ /*) {
            mdlArray.push(resArray[i])
        }

        // .vmt
        if (resArray[i].endsWith(".vmt\"")) {
            materialArray.push(resArray[i])
        }
    }


    // Starting positions
    var curX = 192;
    var curY = 192;
    var curZ = 128;


    // collect the .mdl
    for (var i=0; i < mdlArray.length; i++) {
        curX += 192
        if (curX >= 2880) {
            curX = 192;
            curY += 192;
        }

        // For the mdl, let's create a prop_static
        entityStringCollection += entityStringCreator({
            classname: "prop_static",
            model: mdlArray[i].slice(1, -1).replace("portal2\\", "").replace("portal2_tempcontent\\", "").replace("portal\\", "")
            
            .replace(/\\/g, "/"), // remove the first and last character, since it's a ", and the folders before "model" and replace all "\" with "/"
            origin: `${curX} ${curY} ${curZ}` // Origin X Y Z
        }) + ((i != mdlArray.length - 1) ? "\n" : "") // don't create new line if it's the last of the array

    }


    // collect the materials
    for (var i=0; i < materialArray.length; i++) {

    }

    console.log(entityStringCollection)


    finalResult += entityStringCollection

    document.getElementById("result").value = finalResult
}

// makes it public accessable when used as a module
this.createVMFfromReslist = createVMFfromReslist;

}*/ // end of module