'use strict';

var SM_STATE_NULL = "SM_STATE_NULL";
var SM_EVT_NULL = "SM_EVT_NULL";

class StateMachine
{

  constructor()
  {
    this.state = SM_STATE_NULL;
    this.logic = {
      SM_STATE_NULL: {SM_EVT_NULL: StateMachine.nullfunc}
    };
  }

  processEvent(evt, data)
  {
    if (this.state in this.logic)
    {
      if (evt in this.logic[this.state])
      {
        this.logic[this.state][evt](this, data);
      }
    }
  }

  static nullfunc(sm, data)
  {
    alert('Null state (' + sm.state +') => Null event => Null function => msg: ' + data.msg);
  }

}
