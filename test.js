var input1 = 'def';
var input2 = 'def';

// ++Functions++

// Helper
function update() {
  input1 = $('#input1').val();
  input2 = $('#input2').val();
}

function updateByName(id,value) {
  $(id).val(value);
}

function onBlurTrim(id) {
  var idD = $(id).val().trim();
  updateByName(id,idD);
}

// Action
function selector() {
  update();
  if ($('#selector').val() === 'base') {
    updateByName('#output', 'please pick one');
  } else if ($('#selector').val() === 'longer') {
    updateByName('#output', longer(input1,input2));
  } else if ($('#selector').val() === 'contains') {
    updateByName('#output', contains(input1,input2));
  }
}

function longer(v1t,v2t) {
  v1t = v1t.trim();
  v2t = v2t.trim();
  var v1 = v1t.split('');
  var v2 = v2t.split('');
  if (v1.length === v2.length) {
      return 'equal';
  } else if (v1.length >= v2.length) {
      return v1t;
  } else if (v1.length <= v2.length) {
      return v2t;
  } else {
      return '';
  }
}

function contains(inputt,findingt) {
  var input = inputt.split('');
  var finding = findingt.split('');
  var count = 0;
  var match = 0;
  for (var i = 0; i < input.length; i++) {
    if (finding[0] === input[i]) {
      for (var o = 0; o < finding.length; o++) {
        if (input[i+o] === finding[0+o]) {
          match++;
          if (match >= finding.length) {
            count++;
            match = 0;
          }
        } else {
          match = 0;
        }
      }
    }
  }
  return(count);
}

// ++Handlers++
$('#submit').click(function() {
  selector();
});

$('#input1').blur(function() {
  onBlurTrim('#input1');
});

$('#input2').blur(function() {
  onBlurTrim('#input2');
});
