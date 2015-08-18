'use strict';

var UID_MODE_DIALOG = 0;
var UID_MODE_MOVABLE = 1;

class UIDialog
{
  constructor(title, w, h, mode)
  {
    this.uuid = Utils.generateUUID();
    this.mode = mode;
    this.title = title;
    this.width = w;
    this.height = h;
    this.visible = false;
    this.bkdialogdiv = null;
    this.innerdiv = null;
    this.childDiv = null;

    this.createContents();
    UIManager.getInstance().addDialog(this);
  }

  createContents()
  {
    let obj = this;

    this.innerdiv = document.createElement("div");
    this.innerdiv.id = this.uuid;
    this.innerdiv.className = "dialogdiv";
    this.innerdiv.style.width = this.width + "px";
    this.innerdiv.style.height = this.height + "px";
    var left = (window.innerWidth / 2.0) - (this.width / 2.0);
    var top = (window.innerHeight / 2.0) - (this.height / 2.0);
    this.innerdiv.style.top = top + "px";
    this.innerdiv.style.left = left + "px";

    var titleBar = document.createElement("div");
    titleBar.className = "titleBar";
    titleBar.innerHTML = this.title;
    this.innerdiv.appendChild(titleBar);

    this.childDiv = document.createElement("div");
    this.innerdiv.appendChild(this.childDiv);

    this.btnDiv = document.createElement("div");
    this.btnDiv.className = "btnDiv";
    this.innerdiv.appendChild(this.btnDiv);

    this.cancelBtn = document.createElement("button");
    this.cancelFunc = function(e)
    {
      UIManager.getInstance().processEvent("SMUI_EVENT_HIDEDIALOG", obj.uuid);
    };
    this.cancelBtn.addEventListener("click",this.cancelFunc);
    this.cancelBtn.innerHTML= "Cancel";
    this.cancelBtn.className = "dialogBtn";
    this.btnDiv.appendChild(this.cancelBtn);

    this.okBtn = document.createElement("button");
    this.okBtn.innerHTML = "Accept";
    this.okBtn.className = "dialogBtn";
    this.btnDiv.appendChild(this.okBtn);

    var closeImg = document.createElement("img");
    closeImg.className = "dialogImgs";
    closeImg.src = "img/window-close.svg";
    closeImg.alt = "Close";
    closeImg.title = "Close";
    titleBar.appendChild(closeImg);

    closeImg.addEventListener("click",this.cancelFunc);
  }

  show()
  {
    if (!this.visible)
    {
      if (this.mode === UID_MODE_DIALOG)
      {
        this.bkdialogdiv = document.createElement("div");
        this.bkdialogdiv.id = "bk_" + this.uuid;
        this.bkdialogdiv.className = "bkdialogdiv";
        this.bkdialogdiv.style.width = "100%";
        this.bkdialogdiv.style.height = window.innerHeight + "px";
        document.getElementsByTagName('body')[0].appendChild(this.bkdialogdiv);
      }

      document.getElementsByTagName('body')[0].appendChild(this.innerdiv);

      UIManager.getInstance().processEvent(SMUI_EVENT_OPENDIALOG, this);

      this.visible = true;
    }
  }

  hide()
  {
    if (this.visible)
    {
      if (this.mode === UID_MODE_DIALOG)
      {
        document.getElementsByTagName('body')[0].removeChild(this.bkdialogdiv);
      }
      document.getElementsByTagName('body')[0].removeChild(this.innerdiv);
      this.visible = false;
    }
  }
}
