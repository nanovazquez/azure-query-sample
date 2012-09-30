var TreeHelper = function (folderIconUrl, fileIconUrl) {
    this.folderIconUrl = folderIconUrl || ''; // I prefer the default icon for the folders (instead of the 'Scripts/jstree/_demo/folder.png' image)
    this.fileIconUrl = fileIconUrl || 'Scripts/jstree/_demo/file.png';
    this.treeData = [];
};

TreeHelper.prototype = (function () {

    var createNode = function (name, iconUrl) {
        return {
            'data': {
                'title': name,
                'icon': iconUrl
            },
            'children': []
        };
    };

    var getNodeByTitle = function (nodeTitle, collection) {
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
        var self = this;

        // create a node for each split
        nodes.forEach(function (item, index) {

            // in case we're dealing with a root node (parent is null)
            var siblings = (currentParent && currentParent.children) ? currentParent.children : self.treeData;
            var node = getNodeByTitle(item, siblings);

            if (node == null) {
                var isLeaf = (index + 1 == nodes.length);
                node = createNode(item, (currentParent && isLeaf) ? self.fileIconUrl : self.folderIconUrl);
                siblings.push(node);
            }

            currentParent = node;
        });
    };

    return {
        addNode: addNode,
        getTreeData: function () { return this.treeData; }
    }
})();