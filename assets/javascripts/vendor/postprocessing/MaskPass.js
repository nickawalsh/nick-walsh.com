THREE.MaskPass=function(e,s){this.scene=e,this.camera=s,this.enabled=!0,this.clear=!0,this.needsSwap=!1,this.inverse=!1},THREE.MaskPass.prototype={render:function(e,s,t,a){var n=e.context;n.colorMask(!1,!1,!1,!1),n.depthMask(!1);var i,r;this.inverse?(i=0,r=1):(i=1,r=0),n.enable(n.STENCIL_TEST),n.stencilOp(n.REPLACE,n.REPLACE,n.REPLACE),n.stencilFunc(n.ALWAYS,i,4294967295),n.clearStencil(r),e.render(this.scene,this.camera,t,this.clear),e.render(this.scene,this.camera,s,this.clear),n.colorMask(!0,!0,!0,!0),n.depthMask(!0),n.stencilFunc(n.EQUAL,1,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP)}},THREE.ClearMaskPass=function(){this.enabled=!0},THREE.ClearMaskPass.prototype={render:function(e,s,t,a){var n=e.context;n.disable(n.STENCIL_TEST)}};