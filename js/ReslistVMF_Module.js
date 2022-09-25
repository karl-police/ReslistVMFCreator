// Module definition
const ReslistVMF_Module = new function() {
//

// To create an entity.
function entityStringCreator(contentTable) {
    const entityInfoTable = {}
    entityInfoTable.entity = {}

    Object.assign(entityInfoTable.entity, contentTable) // Merge tables

    var stringifiedTableForVMF = vmfunparser(entityInfoTable)

    return stringifiedTableForVMF
}


class brushPlaneVertex {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    addition(value) {
        this.x += value
        this.y += value
        this.z += value

        return this
    }

    toString() {
        return `${this.x} ${this.y} ${this.z}`
    }
}


class brushTemplateClass {
    constructor(width=128, height=128) {
        this.sides = {
            side1: {
                v1: new brushPlaneVertex(0, width, height),
                v2: new brushPlaneVertex(width, width, height),
                v3: new brushPlaneVertex(width, 0, height),

                uaxis: "[1 0 0 0] 0.25",
                vaxis: "[0 -1 0 0] 0.25"
            },
    
            side2: {
                v1: new brushPlaneVertex(0, 0, 0),
                v2: new brushPlaneVertex(width, 0, 0),
                v3: new brushPlaneVertex(width, width, 0),

                uaxis: "[1 0 0 0] 0.25",
                vaxis: "[0 -1 0 0] 0.25"
            },
    
            side3: {
                v1: new brushPlaneVertex(0, width, height),
                v2: new brushPlaneVertex(0, 0, height),
                v3: new brushPlaneVertex(0, 0, 0),

                uaxis: "[0 1 0 0] 0.25",
                vaxis: "[0 0 -1 0] 0.25"
            },
    
            side4: {
                v1: new brushPlaneVertex(width, width, 0),
                v2: new brushPlaneVertex(width, 0, 0),
                v3: new brushPlaneVertex(width, 0, height),

                uaxis: "[0 1 0 0] 0.25",
                vaxis: "[0 0 -1 0] 0.25"
            },
    
            side5: {
                v1: new brushPlaneVertex(width, width, height),
                v2: new brushPlaneVertex(0, width, height),
                v3: new brushPlaneVertex(0, width, 0),

                uaxis: "[1 0 0 0] 0.25",
                vaxis: "[0 0 -1 0] 0.25"
            },
    
            side6: {
                v1: new brushPlaneVertex(width, 0, 0),
                v2: new brushPlaneVertex(0, 0, 0),
                v3: new brushPlaneVertex(0, 0, height),

                uaxis: "[1 0 0 0] 0.25",
                vaxis: "[0 0 -1 0] 0.25"
            },
        }
    }

    addition(value) {
        for (var i=1; i < Object.keys(this.sides).length + 1; i++) {
            this.sides["side"+ i].v1.addition(value)
            this.sides["side"+ i].v2.addition(value)
            this.sides["side"+ i].v3.addition(value)
        }

        return this
    }

    additionAxis(axis, value) {
        for (var i=1; i < Object.keys(this.sides).length + 1; i++) {
            this.sides["side"+ i].v1[axis] += value
            this.sides["side"+ i].v2[axis] += value
            this.sides["side"+ i].v3[axis] += value
        }

        return this
    }

    moveAxis(axis, value) {
        this.additionAxis(axis, value)

        return this
    }

    materialApplier(sideNum, material) {
        this.sides["side"+sideNum].material = material
    }

    materialFullApplier(material) {
        for (var i=1; i < 7; i++) {
            this.materialApplier(i, material)
        }
    }

    export() {
        var exportString = ""

        for (var i=1; i < Object.keys(this.sides).length + 1; i++) {
            var sideTable = {}
            sideTable.side = {}

            sideTable.side.plane = `(${this.sides["side"+ i].v1.toString()}) (${this.sides["side"+ i].v2.toString()}) (${this.sides["side"+ i].v3.toString()})`
            sideTable.side.material = this.sides["side"+ i].material

            sideTable.side.uaxis = this.sides["side"+ i].uaxis
            sideTable.side.vaxis = this.sides["side"+ i].vaxis
            
            exportString += vmfunparser(sideTable)
        }
        
        return exportString
    }
}


// Function to create a brush
function brushStringCreator(contentTable) {
    const brushStartingContent = "solid {\n" // in VMF solid seems to hold data for a brush
    var output = ""

    const brush = new brushTemplateClass()
    brush.moveAxis("x", contentTable.posX)
    brush.moveAxis("y", contentTable.posY)
    brush.materialFullApplier(contentTable.material)

    output += brushStartingContent + brush.export() + "\n}"

    return output
}



// Used to match a path.
function pathMatchString(str, prePath, matchString) {
    //var regexPattern = new RegExp(`(?:materials\\\\)(debug\\\\)`) // when doing RegEx with string, you get the issue with \ because that's used in RegEx too

    prePath = prePath.replace(/\\/g, "/") // already replace the requested path's \ with /

    var partToMatch = matchString.replace(/\\/g, "/") // replace \ with / for this

    var regexPattern = new RegExp(`(?:${prePath})(${partToMatch})`)

    let matchResult = str.replace(/\\/g, "/").match(regexPattern)

    return matchResult
}


// Used to match a path.
function pathMatchArray(str, prePath, matchArray) {
    for (let i=0; i < matchArray.length; i++) {
        let matchResult = pathMatchString(str, prePath, matchArray[i])

        if (matchResult) {
            return matchResult
        }
    }
}

// Used to match a path and get multiple results.
function pathMultiMatchString(str, prePath, matchArray) {
    const matches = []

    for (let i=0; i < matchArray.length; i++) {
        var pathMatchResult = pathMatchString(str, prePath, matchArray[i])

        if (pathMatchResult) {
            const resultTable = {
                matched: pathMatchResult,
                matchedPart: matchArray[i]
            }
            Object.assign(matches, {[Object.keys(matches).length]: resultTable})
        }
    }

    return matches
}


/*function pathMultiMatch_old(str, prePath, matchArray) {
    prePath = prePath.replace(/\\/g, "/") // already replace the requested path's \ with /

    const matches = []

    for (let i=0; i < matchArray.length; i++) {
        //var regexPattern = new RegExp(`(?:materials\\\\)(debug\\\\)`) // when doing RegEx with string, you get the issue with \ because that's used in RegEx too

        var partToMatch = matchArray[i].replace(/\\/g, "/") // replace \ with / for this

        var regexPattern = new RegExp(`(?:${prePath})(${partToMatch})`)

        let matchResult = str.replace(/\\/g, "/").match(regexPattern)

        if (matchResult) {
            const resultTable = {
                matched: matchResult,
                matchedPart: matchArray[i]
            }
            Object.assign(matches, {[Object.keys(matches).length]: resultTable})
        }
    }
    
    return matches
}*/



class createVMFfromReslist_options {
    modelBlacklistArray = ["humans\\", "gibs\\"]
    materialBlacklistArray = []
}

// Generate a VMF from Reslist file.
/**
 * @param {createVMFfromReslist_options} options A table to configure settings.
 */
function createVMFfromReslist(fileContent, options) {
    // Check if options is there.
    if (typeof(options) != "object") {
        options = new createVMFfromReslist_options()
    }

    const worldStartingContent = "world {\n" // for brushes, as example

    let finalResult = "";


    // The reslist file has every resource on a new line.
    var resArray = fileContent.split("\n");

    var mdlArray = [];
    var materialArray = [];

    var entityStringCollection = "";
    var brushStringCollection = "";

    // loop over every item in the array, check if it contains something certain
    for (var i=0; i < resArray.length; i++) {
        // Remove the line breaks, for this case.
        resArray[i] = resArray[i].replace(/(\r\n|\n|\r)/gm, "");

        // .mdl
        if (resArray[i].endsWith(".mdl\"")) {
            if (!pathMatchArray(resArray[i], "models\\", options.modelBlacklistArray)) {
                mdlArray.push(resArray[i])
            }
        }

        // .vmt
        if (resArray[i].endsWith(".vmt\"")) {
            if (!pathMatchArray(resArray[i], "materials\\", options.materialBlacklistArray)) {
                materialArray.push(resArray[i])
            }
        }

        /*&& !resArray[i].includes("dev\\") && !resArray[i].includes("hud\\") && !resArray[i].includes("effects\\")
        && !resArray[i].includes("vgui\\") && !resArray[i].includes("sprites\\") && !resArray[i].includes("decals\\")*/ //) {
           /* materialArray.push(resArray[i])
        }*/
    }


    // Starting positions, to position the things.
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

        // Fix the mdl path from the value extracted from the reslist.
        let mdlPathValue = 
            mdlArray[i].slice(1, -1) // remove the first and last character, since it's a "
            .replace(/(.*)\\(?=models)/g, "") // remove everything before "models"
            .replace(/\\/g, "/") // replace all "\" with "/"

        // For the mdl, let's create a prop_static
        entityStringCollection += entityStringCreator({
            classname: "prop_static",
            model: mdlPathValue,
            origin: `${curX} ${curY} ${curZ}` // Origin X Y Z
        })

    }


    // collect the materials
    for (var i=0; i < materialArray.length; i++) {
        curX += 192
        if (curX >= 2880) {
            curX = 192;
            curY += 192;
        }

        let materialPathValue =
            materialArray[i].slice(1, -1)
            .replace(/(.*)\\materials\\/g, "") // Remove everything infront of "\materials" and "materials\"
            .replace(/\\/g, "/")
            .replace(/(?=(.*))(.vmt)/g, "") // Remove .vtf at the end
        
        
        // Create brushes to display the materials.
        brushStringCollection += brushStringCreator({
            posX: curX,
            posY: curY,
            material: materialPathValue
        })
    }


    finalResult += entityStringCollection

    // Things that have to enter "world"
    finalResult += worldStartingContent + brushStringCollection + "}"

    document.getElementById("result").value = finalResult
}


// makes it public accessable when used as a module
this.createVMFfromReslist_options = createVMFfromReslist_options
this.createVMFfromReslist = createVMFfromReslist;

} // end of module