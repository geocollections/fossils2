<template>
  <footer class="hidden-xs">
    <!--<div class="container">-->
      <!--<div class="row">-->
        <!--<div class="col-lg-12">-->
      <!---->
          <!--<div class="col-lg-4">-->
            <!--<div class="col-lg-6">-->
              <!--<a class="cc-large" href="http://creativecommons.org/licences/by-nc/3.0/">-->
                <!--<img width="88px" height="31px" alt="Creative Commons Licence" src="/static/imgs/ccbync.png" typeof="foaf:Image"></a>-->
            <!--</div>-->
            <!--<div class="col-lg-6">{{ $t(' footer.licence ') }} </div>-->
          <!--</div>-->
          <!--<div class="col-lg-4"></div>-->


        <!--</div>-->
      <!--</div>-->
      <!--<div class="row">-->
        <!--<div class="col-lg-12">-->
          <!--<div class="footer-logos">-->
            <!--<a href="http://geokogud.info">-->
              <!--<img border="0" style="height: 50px;" src="//geokogud.info/images/sarv_logo_valge1.png" alt="SARV"-->
                   <!--title="SARV: geokogude infosüsteem">-->
            <!--</a>-->
            <!--<a href="http://natarc.ut.ee">-->
              <!--<img border="0" style="height: 50px; margin-left: 25px;" src="//geokogud.info/images/NATARC_transparent.png"-->
                   <!--alt="Natural History Archives and Information Network (NATARC)"-->
                   <!--title="SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)">-->
            <!--</a>-->
            <!--<a href="http://struktuurifondid.ee">-->
              <!--<img border="0" style="height: 50px; margin-left: 25px;" src="//geokogud.info/images/EL_mv.png" alt="EU" title="Euroopa Liit">-->
            <!--</a>-->

            <!--<a href="http://centralbaltic.eu">-->
              <!--<img src="/static/imgs/programme-logo.png" alt="centralbaltic.eu logo" border="0" style="max-width: 316px; width:100%; margin-left: 25px;"/>-->
            <!--</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <table style="  width: 100%; border-top: solid 0px #ccc; border-bottom: solid 0px #ccc;" align="center">
      <tbody>
      <tr>
        <td valign="top" style="width: 33%;">
          <strong>{{ $t(' footer.collections ') }}:</strong>
          <br/>
          <div>
            <a href='http://geokogud.info'>{{ $t(' footer.estonia ') }}</a> |
            <a href='http://www.nrm.se/en/menu/researchandcollections/departments/palaeozoology/collections.870_en.html'>{{ $t(' footer.sweden ') }}</a> |
            <a href='http://www.luomus.fi/english/geology/'>{{ $t(' footer.finland ') }}</a>
          </div>
          <br/>
          <strong>{{ $t(' footer.related ') }}:</strong><br/>
          <a href='http://naturforskaren.se'>Naturforskaren</a><br/>
          <a href='http://elurikkus.ut.ee'>eElurikkus</a><br/>
          <a href='http://www.geocase.eu'>GeoCASe</a><br/>
          <a href='http://www.open-up.eu'>OpenUp!</a><br/>
        </td>
        <td valign="top" style="border-left: solid 0px #ccc; border-right: dotted 0px #ccc;">
          <div id='lang-flags'>
            <lang-buttons lang-class="'footer'"/>
          </div>
          {{ $t(' footer.licence ') }}
          <div><br/>
            <a class="cc-large" href="http://creativecommons.org/licences/by-nc/3.0/">
              <img width="88px" height="31px"
                   alt="Creative Commons Licence"
                   src="/static/imgs/ccbync.png"
                   typeof="foaf:Image"></a>
            <br/>

          </div>
        </td>
        <td valign="top" style="width: 33%;">
          <a href="http://www.balticdiversity.eu"><strong>BALTICDIVERSITY 2012-2013</strong></a><br/><br/>
          <a href="http://www.gi.ee">{{ $t(' footer.gi ') }}</a><br/>
          <a href="http://natmuseum.ut.ee">{{ $t(' footer.ut ') }}</a><br/>
          <a href="http://emu.ee">{{ $t(' footer.emu ') }}</a><br/>
          <a href="http://www.luomus.fi">{{ $t(' footer.fmnh ') }}</a><br/>
          <a href="http://nrm.se">{{ $t(' footer.nrm ') }}</a><br/>
          <br/>
        </td>
      </tr>
      </tbody>
    </table>
    <div style="margin: 10px 0 10px 0;">
      <a href="http://geokogud.info">
        <img border="0" style="height: 50px;" src="//geokogud.info/images/sarv_logo_valge1.png" alt="SARV"
             title="SARV: geokogude infosüsteem">
      </a>
      <a href="http://natarc.ut.ee">
        <img border="0" style="height: 50px; margin-left: 25px;" src="//geokogud.info/images/NATARC_transparent.png"
             alt="Natural History Archives and Information Network (NATARC)"
             title="SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)">
      </a>
      <a href="http://struktuurifondid.ee">
        <img border="0" style="height: 50px; margin-left: 25px;" src="//geokogud.info/images/EL_mv.png" alt="EU" title="Euroopa Liit">
      </a>

      <a href="http://centralbaltic.eu">
        <img src="/static/imgs/programme-logo.png" alt="centralbaltic.eu logo" border="0" style="max-width: 316px; width:100%; margin-left: 25px;"/>
      </a>
    </div>
  </footer>
  <!-- end footer -->
</template>

<script>
  import LangButtons from '../components/LangButtons.vue'
  export default {
    name: "app-footer",
    components:  {
      LangButtons
    }
  }
</script>
<!--<style src="../../node_modules/flag-icon-css/css/flag-icon.min.css">-->

<!--</style>-->
<style lang="stylus" scoped>
  footer
    background-color: #f8f9fa
    padding: 8px 16px
    font-size: 0.75rem
    text-align: center
</style>
