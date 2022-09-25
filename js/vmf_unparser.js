// Source from https://github.com/lukesrw/vmfunparser/blob/master/src/index.ts
// Converted from TypeScript to JavaScript.

// Converts JSON to VMF
function vmfunparser(json, depth) {
    var vmf = [];
    var is_init = depth === undefined;
    depth = depth || 0;
    var depth_pad = "\t".repeat(depth);
    Object.keys(json).forEach(function (key) {
        switch (typeof json[key]) {
            case "string":
                vmf.push("".concat(depth_pad, "\"").concat(key, "\" \"").concat(json[key], "\""));
                break;
            case "object":
                if (Array.isArray(json[key])) {
                    json[key].forEach(function (part) {
                        var _a;
                        vmf = vmf.concat(vmfunparser((_a = {},
                            _a[key] = part,
                            _a), depth));
                    });
                }
                else {
                    vmf.push("".concat(depth_pad + key), "".concat(depth_pad, "{"), vmfunparser(json[key], (depth || 0) + 1), "".concat(depth_pad, "}"));
                }
                break;
        }
    });
    if (is_init)
        vmf.push("");
    return vmf.join("\r\n");
}
