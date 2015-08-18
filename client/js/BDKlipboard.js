'use strict';

class BDKlipboard {
  constructor(){
    this.innerClipboard = null;
  }

  copy(e){
    if (BDKanvasInstance.selection !== null){
      var data = BDKanvasInstance.selection.serialize();
      var jsonData = JSON.stringify(data);
      if (e && e.clipboardData){
        e.clipboardData.setData('application/json', jsonData);
        e.preventDefault();
      } else {
        this.innerClipboard = data;
      }
    }
  }

  cut(e){
    if (BDKanvasInstance.selection !== null){
      var data = BDKanvasInstance.selection.serialize();
      var jsonData = JSON.stringify(data);
      if (e && e.clipboardData){
        e.clipboardData.setData('application/json', jsonData);
        e.preventDefault();
      } else {
        this.innerClipboard = data;
      }
      BDKanvasInstance.deleteSelectedElements();
    }
  }

  static onLoadIMG(e){
    var img = new Image();
    img.src = e.target.result;
    var  bdkimg = new BDKImage(BDKanvasInstance.context, null);
    bdkimg.setImage(img);
    var action = new ActionCommitImage(bdkimg, true, null);
    action.performAction();
  }

  getImgData(e){
    var result = false;
    for (var i = 0; i < e.clipboardData.items.length; i++) {
      var item = e.clipboardData.items[i];
      if (item.type.indexOf("image") !== -1){
        var blob = item.getAsFile();
        var reader = new FileReader();
        reader.onload = BDKlipboard.onLoadIMG;
        reader.readAsDataURL(blob);
        result = true;
      }
    }
    return result;
  }

  createSVGFromHTML(htmlData){
    /*var doc = document.implementation.createHTMLDocument("");
    doc.write(htmlData);
    doc.documentElement.setAttribute("xmlns", doc.documentElement.namespaceURI);
    htmlData = (new XMLSerializer).serializeToString(doc);*/
   /* var url = 'data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
           '<foreignObject width="100%" height="100%">' +
           '<div xmlns="http://www.w3.org/1999/xhtml">' +
           htmlData +
           '</div>' +
           '</foreignObject>' +
           '</svg>';
    var img = new Image();
    img.src = url;
    var  bdkimg = new BDKImage(BDKanvasInstance.context, null);
    bdkimg.setImage(img);
    var action = new ActionCommitImage(bdkimg, true, null);
    action.performAction();*/
  }

  paste(e){
    var result = false;
    if (e && e.clipboardData) {
      var jsonData = e.clipboardData.getData("application/json");
      if (jsonData) {
        var data = JSON.parse(jsonData);
        var drawables = [];
        for (var i = 0; i < data.length; i++) {
          try {
            var ddata = data[i];
            var evalStr = ddata.drawableType + ".unserialize" + ddata.drawableVersion + "(ddata);";
            var drawable = eval(evalStr);
            drawable.resetUUID();
            drawables.push(drawable);
          } catch (ex) {
            // Different json object...
          }
        }

        if (drawables.length > 0){
          result = true;
          var action = new ActionPasteDrawables(drawables, true, null);
          action.performAction();
        }
      } else {
        result = this.getImgData(e);
        /*if (!hasImg) {
          var htmlData = e.clipboardData.getData("text/html");
          if (htmlData){
            this.createSVGFromHTML(htmlData);
          }
        }*/
      }
    } else {
      var data = this.innerClipboard;
      var drawables = [];
      for (var i = 0; i < data.length; i++) {
        try {
          var ddata = data[i];
          var evalStr = ddata.drawableType + ".unserialize" + ddata.drawableVersion + "(ddata);";
          var drawable = eval(evalStr);
          drawable.resetUUID();
          drawables.push(drawable);
        } catch (ex) {
          // Different json object...
        }
      }
      if (drawables.length > 0){
        result = true;
        var action = new ActionPasteDrawables(drawables, true, null);
        action.performAction();
      }
    }

    return result;
  }

}
