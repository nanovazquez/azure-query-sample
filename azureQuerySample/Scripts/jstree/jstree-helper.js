var InitTreeHelper = (function () {

    var treeData = [];

    var folderIconUrl = ""; // I prefer the 'default icon' for the folders (instead of "Scripts/jstree/_demo/folder.png")
    var fileIconUrl = "Scripts/jstree/_demo/file.png";
    var createNode = function (name, isFile) {
        return {
            "data": {
                "title": name,
                "icon": isFile ? fileIconUrl : folderIconUrl
            },
            "children": []
        };
    };
    var getNodeByTitleIn = function (nodeTitle, collection) {
        var toReturn = null;
        collection.forEach(function (item, index) {
            if (item.data.title === nodeTitle) {
                toReturn = item;
                return;
            }
        });
        return toReturn;
    };

    var addNode = function (nodeFullPath, currentParent) {

        var nodes = nodeFullPath.split('/');

        // create a node for each split
        nodes.forEach(function (item, index) {

            // in case we're dealing with a root node (parent is null)
            var siblings = (currentParent && currentParent.children) ? currentParent.children : treeData;
            var node = getNodeByTitleIn(item, siblings);
            
            if (node == null) {
                var isLeaf = (index + 1 == nodes.length);
                node = createNode(item, currentParent && isLeaf);
                siblings.push(node);
            }

            currentParent = node;
        });
    };

    return {
        addNode: addNode,
        getTreeData: function () { return treeData; }
    }
});
