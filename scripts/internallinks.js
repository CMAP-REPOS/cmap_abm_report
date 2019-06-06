//https://stackoverflow.com/questions/26352181/link-to-specific-tab-bootstrap
//https://stackoverflow.com/questions/1343178/change-active-li-when-clicking-a-link-jquery 

$(function() {
  // Javascript to enable link to tab
  var hash = document.location.hash;
  if (hash) {
    //console.log(hash);
    $('.nav-tabs a[href=\\'+hash+']').tab('show');
  }

  // Change hash for page-reload
  $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    window.location.hash = e.target.hash;
    window.scrollTo(0,0);
    var hash = document.location.hash;
    $('li').removeClass();
    $('.nav-tabs a[href=\\'+hash+']').parent().addClass('active');
  });
});
