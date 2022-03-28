import * as zebkit from './lib/zebkit.min.js'

zebkit.require("ui", "layout", function(ui, layout) {
    // create Canvas using JSON like style
    var zc = new ui.zCanvas();
    zc.root.properties({
        borderLayout: 4,
        padding: 8,
        kids  : {
            center: new ui.TextArea("", true),
            top   : (new ui.BoldLabel("Sample application")).properties({
                padding : 8
            }),
            bottom: new ui.Button("Select all")
        }
    }).on("//zebkit.ui.Button", function(bt) { // reg event handler
        // select text in the text area
        zc.byPath("//zebkit.ui.TextArea").selectAll();
    });
});