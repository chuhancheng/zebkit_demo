import Konva from 'konva';

const container = document.createElement('div');
container.id = 'container';
document.body.appendChild(container);

// var width = window.innerWidth;
// var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: 400,
    height: 400,
});

var layer = new Konva.Layer();

var rect1 = new Konva.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
});
// add the shape to the layer
// layer.add(rect1);

var rect2 = new Konva.Rect({
    x: 150,
    y: 40,
    width: 100,
    height: 50,
    fill: 'red',
    shadowBlur: 10,
    cornerRadius: 10,
});
// layer.add(rect2);

var rect3 = new Konva.Rect({
    x: 50,
    y: 120,
    width: 100,
    height: 100,
    fill: 'blue',
    cornerRadius: [0, 10, 20, 30],
});
// layer.add(rect3);

// create our shape
var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
});

// layer.add(circle);

var pentagon1 = new Konva.RegularPolygon({
    x: stage.width() / 2,
    y: stage.height() / 2,
    sides: 5,
    radius: 70,
    fill: '#0092ff',
    stroke: 'black',
    strokeWidth: 4,
    name: 'rect', // 為了要讓選取匡可以選到
    // shadowOffsetX : 20,
    // shadowOffsetY : 25,
    // shadowBlur : 40,
    // opacity : 0.5
});
pentagon1.draggable(true);

layer.add(pentagon1);

var pentagon2 = new Konva.RegularPolygon({
    x: 50,
    y: 50,
    sides: 5,
    radius: 70,
    fill: '#0092ff',
    stroke: 'black',
    strokeWidth: 4,
    name: 'rect', // 為了要讓選取匡可以選到
    // shadowOffsetX : 20,
    // shadowOffsetY : 25,
    // shadowBlur : 40,
    // opacity : 0.5
});
pentagon2.draggable(true);

layer.add(pentagon2);

console.log('pentagon1.zIndex:', pentagon1.zIndex());
console.log('pentagon2.zIndex:', pentagon2.zIndex());

// add the layer to the stage
stage.add(layer);

// 把場景存起來
var json = stage.toJSON();
console.log('json:', JSON.parse(json));

// 從資料恢復場景
// var stage = Konva.Node.create(json, 'container');

var scaleBy = 1.01;
stage.on('wheel', (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    var oldScale = stage.scaleX();
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction;
    }

    var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
});

var tr = new Konva.Transformer();
layer.add(tr);

// by default select all shapes
tr.nodes([rect1, rect2]);

// add a new feature, lets add ability to draw selection rectangle
var selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
});
layer.add(selectionRectangle);

let x1: number, y1: number, x2: number, y2: number;
stage.on('mousedown touchstart', (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
        return;
    }
    e.evt.preventDefault();
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
});

stage.on('mousemove touchmove', (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
        return;
    }
    e.evt.preventDefault();
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
    });
});

stage.on('mouseup touchend', (e) => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
        return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
        selectionRectangle.visible(false);
    });

    var shapes = stage.find('.rect');
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    tr.nodes(selected);
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      tr.nodes([]);
      return;
    }

    // do nothing if clicked NOT on our rectangles
    // if (!e.target.hasName('rect')) {
    //   return;
    // }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
  });



// import * as zebkit from './lib/zebkit.min.js'

// zebkit.require("ui", "layout", function(ui, layout) {
//     // create Canvas using JSON like style
//     var zc = new ui.zCanvas();
//     zc.root.properties({
//         borderLayout: 4,
//         padding: 8,
//         kids  : {
//             center: new ui.TextArea("", true),
//             top   : (new ui.BoldLabel("Sample application")).properties({
//                 padding : 8
//             }),
//             bottom: new ui.Button("Select all")
//         }
//     }).on("//zebkit.ui.Button", function(bt) { // reg event handler
//         // select text in the text area
//         zc.byPath("//zebkit.ui.TextArea").selectAll();
//     });
// });