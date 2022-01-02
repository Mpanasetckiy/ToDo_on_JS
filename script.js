$('document').ready(function(){
  $('button').on('click', function(){
    var value1, value2, value3;

    value1 = $('#val1').val();
    value2 = $('#val2').val();
    value3 = value1 + value2;

    value1 = parseInt(value1);
    value2 = parseInt(value2);
  
    alert(value1 + value2);
    
   });

});