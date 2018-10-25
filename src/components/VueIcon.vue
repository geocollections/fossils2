<template>
  <!--<i class="Chevron"></i>-->
  <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" version="1.1">-->
    <!--<defs id="defs6"/>-->
    <!--<g transform="matrix(1.3333333,0,0,-1.3333333,0,400)" id="g10">-->
      <!--<g transform="translate(178.0626,235.0086)" id="g12">-->
        <!--<path id="path14" style="fill:#4dba87;fill-opacity:1;fill-rule:nonzero;stroke:none"-->
              <!--d="M 0,0 -22.669,-39.264 -45.338,0 h -75.491 L -22.669,-170.017 75.491,0 Z"/>-->
      <!--</g>-->
      <!--<g transform="translate(178.0626,235.0086)" id="g16">-->
        <!--<path id="path18" style="fill:#435466;fill-opacity:1;fill-rule:nonzero;stroke:none"-->
              <!--d="M 0,0 -22.669,-39.264 -45.338,0 H -81.565 L -22.669,-102.01 36.227,0 Z"/>-->
      <!--</g>-->
    <!--</g>-->
  <!--</svg>-->

</template>
<style>
  .Chevron{
    position:relative;
    display:block;
    /*height:40px;!*height should be double border*!*/
  }
  .Chevron:before,
  .Chevron:after{
    position:absolute;
    display:block;
    content:"";
    border:20px solid transparent;/*adjust size*/
  }
  /* Replace all text `top` below with left/right/bottom to rotate the chevron */
  .Chevron:before{
    bottom:0;
    border-bottom-color:#b00;/*Chevron Color*/
  }
  .Chevron:after{
    bottom:-5px;/*adjust thickness*/
    border-bottom-color:#fff;/*Match background colour*/
  }
</style>