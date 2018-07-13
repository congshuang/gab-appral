const findFromTree = (treeArray, id, idPropName = "id", childrenPropName = "children") => {
  if (!treeArray || treeArray == null || treeArray.length <= 0)return null;
  for (var i = 0; i < treeArray.length; i++) {
    if (treeArray[i][idPropName] == id) {
      return treeArray[i];
    } else {
      var result = findFromTree(treeArray[i][childrenPropName], id, idPropName, childrenPropName);
      if (result != null) {
        return result;
      }
    }
  }
  return null;
}
const setMenuLists = (treeArray , list, childrenPropName = "children") => {
  if (!treeArray || treeArray == null || treeArray.length <= 0)return null;
  for (var i = 0; i < treeArray.length; i++) {
      var res = {};
      res.href = treeArray[i]['href'];
      res.id = treeArray[i]['id'];
      res.name = treeArray[i]['name'];
      list.push(res);
      var result = setMenuLists(treeArray[i][childrenPropName], list, childrenPropName);
      if (result != null) {
        return result;
      }
  }
  return null;
}
const findParentId = (treeArray, id, obj, idPropName = "parentId", childrenPropName = "children", names = "name") => {
  if (id == null || !treeArray || treeArray == null || treeArray.length <= 0)return null;
  for (var i = 0; i < treeArray.length; i++) {
    console.log(11)
    if (treeArray[i][idPropName] == id) {
      console.log(treeArray)
     return obj[names];
    } else {
      var result = findParentId(treeArray[i][childrenPropName], treeArray[i], id, idPropName, childrenPropName ,names);
      if (result != null) {

        return result;
      }
    }
  }
  return null;
}

const changeType = (list, idPropName = "pattern" ,idPropNames = "pattern1") => {
  if (!list || list == null || list.length <= 0) return list;
  for (let i = 0; i < list.length; i++) {

    if(list[i][idPropNames] instanceof  Array){
      return list;
    }else{
      if(list[i][idPropName] !== null){
        list[i][idPropNames] = list[i][idPropName].split(',');
      }
    }

  }
  return list;
}
const appendTreeNode = (treeArray, item, idPropName = "id", parentPropName = "parentId", childrenPropName = "children") => {
  if (!item[parentPropName] || item[parentPropName] == null) {
    var i = treeArray.findIndex(p => p.sort > item.sort);
    if (i == -1) {
      i = treeArray.length;
    }
    treeArray.splice(i, 0, item);
    return;
  }
  for (var j = 0; j < treeArray.length; j++) {
    var value = treeArray[j];
    if (item[parentPropName] == value[idPropName]) {
      if (value[childrenPropName] && value[childrenPropName].length > 0) {
        var i = value[childrenPropName].findIndex(p => p.sort > item.sort);
        if (i == -1) {
          i = value[childrenPropName].length;
        }
        value[childrenPropName].splice(i, 0, item);
      } else {
        value[childrenPropName] = [];
        value[childrenPropName].push(item);
      }
    } else {
      appendTreeNode(value[childrenPropName], item, idPropName, parentPropName, childrenPropName);
    }
  }
}

const deleteFromTree = (list, id, idPropName = "id", childrenPropName = "children") => {
  if (!list || list == null || list.length <= 0) return;
  for (var i = 0; i < list.length; i++) {
    if (list[i][idPropName] == id) {
      list.splice(i, 1);
      return true;
    } else {

      var result = deleteFromTree(list[i][childrenPropName], id, idPropName, childrenPropName);

      if (result) {

        return result;
      }
    }
  }
}
  const setCheckedNodes = (list, listnodes, idPropName = "id", childrenPropName = "children") => {
  if (!list || list == null || list.length <= 0)return;
  for (var i = 0; i < list.length; i++) {
    listnodes.push(list[i][idPropName]);   if (list[i][childrenPropName] !== null){

      setCheckedNodes(list[i][childrenPropName], listnodes, idPropName, childrenPropName);
    }
  }
  };
  const deleteList = (list, id, idPropName = "id", childrenPropName = "children") => {
  if (!list || list == null || list.length <= 0)return;
  for (var i = 0; i < list.length; i++) {
    if (list[i][idPropName] == id) {
      list.splice(i, 1);
      return;
    }
  }
  return;
  }


const batchDeleteFromTree = (list, ids, idPropName = "id", childrenPropName = "children") => {
  if (!list || list == null || list.length <= 0)return;
  if (!ids || ids == null || ids.length <= 0)return;
  for (var i = 0; i < list.length; i++) {
    if (ids.findIndex(x => x == list[i][idPropName])>-1) {
      list.splice(i, 1);
      i--;
      continue;
    } else {
      batchDeleteFromTree(list[i][childrenPropName], ids, idPropName, childrenPropName);
    }
  }
}

const updateTreeNode = (list, item, idPropName = "id", childrenPropName = "children") => {
  if (!list || list == null || list.length <= 0) return false;
  for (var i = 0; i < list.length; i++) {
    if (list[i][idPropName] == item[idPropName]) {
      list.splice(i, 1, item);

      return true;
    } else {
      var result = updateTreeNode(list[i][childrenPropName], item, idPropName, childrenPropName);
      if (result) {
        return result;
      }
    }
  }
  return false;
}

export default {
  methods: {
    findFromTree,
    appendTreeNode,
    deleteFromTree,
    updateTreeNode,
    batchDeleteFromTree,
    setCheckedNodes,
    deleteList,
    changeType,
    findParentId,
    setMenuLists
  }
};
