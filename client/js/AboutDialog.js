'use strict';

class AboutDialog extends UIDialog {
  constructor(title, w, h, mode) {
    super(title,w,h,mode);
    this.createChildContents();
  }

  createChildContents(){
    this.okBtn.addEventListener("click",this.cancelFunc);
    this.childDiv.style.textAlign = "center";

    this.childDiv.innerHTML =
    "<p>(c) 2015 Jorge García Ochoa de Aspuru</p>\
    <p>@bardok</p>\
    <p><a href='http://projects.bardok.net/bdkanvas/'>BDKanvas project site</a></p>\
    <p>This project is licensed under the <a href='http://www.gnu.org/licenses/gpl-3.0.html'>GPLv3 license</a>.</p>\
    <p>The icons used are part of the <a href='https://github.com/NitruxSA/breeze-icon-theme'>Breeze Icon Theme</a> licensed under the LGPLv3</p>";
  }
}
