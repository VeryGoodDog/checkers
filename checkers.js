var boardWidth = $('#board').width();
var currentPlayer = 'black';
var transferLoc = [0,0];
var validDrop = null;
var jumpedCheckers = [];
var activeChecker = {};
var cascadeReturn = {};
cascadeReturn.canJump = [0,0];
var indexOfJump = 0;
// var column = null;
// var row = null;
init();

function generateChecker(x,y,classes) {
  $('[data-column='+x+'][data-row='+y+']')
  .html('<div id="'+x+''+y+'" data-crow='+y+' data-ccolumn='+x+'></div>');
  for (var i = 0; i < classes.length; i++) {
    $('#'+x+y)
    .addClass(classes[i]);
  }
  size('#'+x+y,boardWidth/8, boardWidth/8);
  $('#'+x+''+y)
  .draggable({
    revert: 'invalid',
    revertDuration: 0,
    scroll: false,
    start: function (event) {
      var column = Number(event.target.dataset.ccolumn);
      var row = Number(event.target.dataset.crow);
      fullCascade(column,row,event.target.classList[0]);
      },
    stop: function (event) {
      var column = Number(event.target.dataset.ccolumn);
      var row = Number(event.target.dataset.crow);
      if (validDrop && !(row === transferLoc[0] && column === transferLoc[1])) {
        deleteChecker(column,row);
        generateChecker(transferLoc[1],transferLoc[0],event.target.classList);
        validDrop = false;
        togglePlayer();
        disableAllSpots();
      } else {
        deleteChecker(column,row);
        generateChecker(column,row,event.target.classList);
        disableAllSpots();
        activeChecker.active = false;
      }
    }
  })
  .mouseenter(function (event) {
    var column = Number(event.target.dataset.ccolumn);
    var row = Number(event.target.dataset.crow);
    if (activeChecker.active !== true && checkSpot(column,row).colour === currentPlayer) {
      enableChecker(column,row);
      fullCascade(column,row,currentPlayer)
    }
  })
  .mouseleave(function (event) {
    if (activeChecker.active !== true) {
      disableAllSpots();
    }
  })
  .mousedown(function (event) {
    if (currentPlayer === event.target.classList[0]) {
      var column = Number(event.target.dataset.ccolumn);
      var row = Number(event.target.dataset.crow);
      disableAllSpots();
      activeChecker.column = column;
      activeChecker.row = row;
      activeChecker.active = true;
      fullCascade(column,row,event.target.classList[0]);
    }
  });
}

function init() {
  $('.red')
  .dblclick(function (event) {
    if (event.target.dataset != undefined) {
      deleteChecker(event.target.dataset.ccolumn,event.target.dataset.crow);
    }
  })
  .droppable({
    drop: function (event) {
      transferLoc[0] = Number(event.target.dataset.row);
      transferLoc[1] = Number(event.target.dataset.column);
      validDrop = true;
      activeChecker.active = false;
    }
  });

  size('#board',boardWidth,'40%');
  size('.c', boardWidth, boardWidth/8);
  size('.r', boardWidth/8, boardWidth/8);
  size('#header', boardWidth/7, 'auto');
  size('#playerCont', boardWidth/7,boardWidth/3);
  setBoard();

  $('#restartButton')
  .mouseover(function (event) {
    $('#restartButton')
    .html('Are you sure?')
    .addClass('red');
  })
  .mouseleave(function (event) {
    $('#restartButton')
    .html('Restart')
    .removeClass('red');
  })
  .mousedown(function (event) {
    $('#restartButton')
    .html('Restart')
    .removeClass('red');
    setBoard();
  });

  $(window)
  .resize(function (event) {
    boardWidth = $('#board').width();
    size('#board',boardWidth,'40%');
    size('.c', boardWidth, boardWidth/8);
    size('.r', boardWidth/8, boardWidth/8);
    size('.checker', boardWidth/8, boardWidth/8)
    size('#header', boardWidth/7, 'auto');
    size('#playerCont', boardWidth/7,boardWidth/3);
  });
}

function restrict(input,min,max) {
  if (input > max) {
    return max;
  } else if (input < min) {
    return min;
  } else {
    return input;
  }
}

function size(el,height,width) {
  $(el)
  .height(height)
  .width(width);
}

function togglePlayer() {
  console.log('player toggled');
  if (currentPlayer === 'grey') {
    currentPlayer = 'black';
    $('#playerBoard')
    .html('Red');
    $('.grey')
    .draggable('disable');
    $('.black')
    .draggable('enable');
  } else {
    currentPlayer = 'grey';
    $('#playerBoard')
    .html('White');
    $('.black')
    .draggable('disable');
    $('.grey')
    .draggable('enable');
  }
}

function setPlayer(player) {
  switch (player) {
    case 'grey':
      currentPlayer = 'grey';
      $('#playerBoard')
      .html('Red');
      $('.grey')
      .draggable('disable');
      $('.black')
      .draggable('enable');
      break;
    case 'black':
      currentPlayer = 'black';
      $('#playerBoard')
      .html('White');
      $('.black')
      .draggable('disable');
      $('.grey')
      .draggable('enable');
      break;

  }
}

function deleteChecker(x,y) {
  console.log('checker deleted at:',x,' ',y);
  $('#'+x+y).remove();
}

function deleteAllChecker() {
  console.log('all checker deleted');
  for (var i = 1; i <= 8; i++) {
    for (var o = 1; o <= 8; o++) {
      deleteChecker(i,o);
    }
  }
}

function enableSpot(x,y) {
  console.log('spot enabled at:',x,' ',y);
  $('[data-column='+JSON.stringify(x)+'][data-row='+JSON.stringify(y)+'].red')
  .droppable('enable')
  .removeClass('red')
  .addClass('yellow');
}

function enableChecker(x,y) {
  console.log('checker enabled at:',x,' ',y);
  $('#'+x+''+y).draggable('enable');
}

function enableAllChecker() {
  console.log('all checker enabled');
  for (var i = 1; i <= 8; i++) {
    for (var o = 1; o <= 8; o++) {
      enableChecker(i,o);
    }
  }
}

function disableChecker(x,y) {
  console.log('checker disabled at:',x,'',y);
  $('#'+x+''+y)
  .draggable('disable');
}

function disableAllChecker() {
  console.log('all checkers disabled');
  for (var i = 1; i <= 8; i++) {
    for (var o = 1; o <= 8; o++) {
      disableChecker(i,o);
    }
  }
  spotsAvailable = false;
}

function checkSpot(x,y) {
  var event = $('[data-column='+x+'][data-row='+y+']');
  console.log('checking',x,y,event);
    if (event[0] == undefined) {
      console.log('240 no');
      return {'val':false,'colour':null};
    }
    if (event[0].firstChild == undefined || event[0].firstChild.localName !== 'div') {
      console.log('yes');
      return {'val':true,'colour':null};
    }
    console.log('somethings here? c',event[0].firstChild.classList[0]);
    return {'val':false,'colour':event[0].firstChild.classList[0]};
}

function cascade(x,y,colour) {
  switch (colour) {
    case 'grey':
      if (x === 1) {
        if (checkSpot(x+2,y-2).val && checkSpot(x+1,y-1).colour === 'black') {
          enableSpot(x+2,y-2);
          cascade(x+2,y-2,'grey');
        }
      } else if (x === 8) {
        if (checkSpot(x-2,y-2).val && checkSpot(x-1,y-1).colour === 'black') {
          enableSpot(x-2,y-2);
          cascade(x-2,y-2,'grey');
        }
      } else {
        if (checkSpot(x-2,y-2).val && checkSpot(x-1,y-1).colour === 'black') {
          enableSpot(x-2,y-2);
          cascade(x-2,y-2,'grey');
        }
        if (checkSpot(x+2,y-2).val && checkSpot(x+1,y-1).colour === 'black') {
          enableSpot(x+2,y-2);
          cascade(x+2,y-2,'grey');
        }
      }
      break;
    case 'black':
      // console.log('black');
      if (x === 8) {
        if (checkSpot(x-2,y+2).val && checkSpot(x-1,y+1).colour === 'grey') {
          enableSpot(x-2,y+2);
          cascade(x-2,y+2,'black');
        }
      } else if (x === 1) {
        if (checkSpot(x+2,y+2).val && checkSpot(x+1,y+1).colour === 'grey') {
          enableSpot(x+2,y+2);
          cascade(x+2,y+2,'black');
        }
      } else {
        if (checkSpot(x-2,y+2).val && checkSpot(x-1,y+1).colour === 'grey') {
          enableSpot(x-2,y+2);
          cascade(x-2,y+2,'black');
        }
        if (checkSpot(x+2,y+2).val && checkSpot(x+1,y+1).colour === 'grey') {
          enableSpot(x+2,y+2);
          cascade(x+2,y+2,'black');
        }
      }
      break;
    }
}

function fullCascade(column,row,colour) {
  switch (colour) {
    case 'grey':
      if (column === 1) {
        if (checkSpot(column+1,row-1).val) {
          enableSpot(column+1,row-1);
        } else if (checkSpot(column+2,row-2).val && !(checkSpot(column+1,row-1).colour === 'grey')) {
          enableSpot(column+2,row-2);
          cascade(column+2,row-2,'grey');
        }
      } else if (column === 8) {
        if (checkSpot(column-1,row-1).val) {
          enableSpot(column-1,row-1);
        } else if (checkSpot(column-2,row-2).val && !(checkSpot(column-1,row-1).colour === 'grey')) {
          enableSpot(column-2,row-2);
          cascade(column-2,row-2,'grey');
        }
      } else {
        if (checkSpot(column-1,row-1).val) {
          enableSpot(column-1,row-1);
        } else if (checkSpot(column-2,row-2).val && !(checkSpot(column-1,row-1).colour === 'grey')) {
          enableSpot(column-2,row-2);
          cascade(column-2,row-2,'grey');
        }
        if (checkSpot(column+1,row-1).val) {
          enableSpot(column+1,row-1);
        } else if (checkSpot(column+2,row-2).val && !(checkSpot(column+1,row-1).colour === 'grey')) {
          enableSpot(column+2,row-2);
          cascade(column+2,row-2,'grey');
        }
      }
      break;
    case 'black':
      if (column === 8) {
        if (checkSpot(column-1,row+1).val) {
          enableSpot(column-1,row+1);
        } else if (checkSpot(column-2,row+2).val && !(checkSpot(column-1,row+1).colour === 'black')) {
          enableSpot(column-2,row+2);
          cascade(column-2,row+2,'black');
        }
      } else if (column === 1) {
        if (checkSpot(column+1,row+1).val) {
          enableSpot(column+1,row+1);
        } else if (checkSpot(column+2,row+2).val && !(checkSpot(column+1,row+1).colour === 'black')) {
          enableSpot(column+2,row+2);
          cascade(column+2,row+2,'black');
        }
      } else {
        if (checkSpot(column-1,row+1).val) {
          enableSpot(column-1,row+1);
        } else if (checkSpot(column-2,row+2).val && !(checkSpot(column-1,row+1).colour === 'black')) {
          enableSpot(column-2,row+2);
          cascade(column-2,row+2,'black');
        }
        if (checkSpot(column+1,row+1).val) {
          enableSpot(column+1,row+1);
        } else if (checkSpot(column+2,row+2).val && !(checkSpot(column+1,row+1).colour === 'black')) {
          enableSpot(column+2,row+2);
          cascade(column+2,row+2,'black');
        }
      }
      break;
    }
}

function cascadeCheck(x,y,colour) {
  switch (colour) {
    case 'grey':
      if (x === 1) {
        if (checkSpot(x+2,y-2).val && checkSpot(x+1,y-1).colour === 'black') {
          cascadeReturn.canJump[indexOfJump] = [column+1,row-1];
          indexOfJump++;
          cascade(x+2,y-2,'grey');
        }
      } else if (x === 8) {
        if (checkSpot(x-2,y-2).val && checkSpot(x-1,y-1).colour === 'black') {
          cascadeReturn.canJump[indexOfJump] = [column-1,row-1];
          cascade(x-2,y-2,'grey');
        }
      } else {
        if (checkSpot(x-2,y-2).val && checkSpot(x-1,y-1).colour === 'black') {
          cascadeReturn.canJump[indexOfJump] = [column-1,row-1];
          indexOfJump++;
          cascade(x-2,y-2,'grey');
        }
        if (checkSpot(x+2,y-2).val && checkSpot(x+1,y-1).colour === 'black') {
          cascadeReturn.canJump[indexOfJump] = [column+1,row-1];
          indexOfJump++;
          cascade(x+2,y-2,'grey');
        }
      }
      break;
    case 'black':
      if (x === 8) {
        if (checkSpot(x-2,y+2).val && checkSpot(x-1,y+1).colour === 'grey') {
          cascadeReturn.canJump[indexOfJump] = [column-1,row+1];
          indexOfJump++;
          cascade(x-2,y+2,'black');
        }
      } else if (x === 1) {
        if (checkSpot(x+2,y+2).val && checkSpot(x+1,y+1).colour === 'grey') {
          cascadeReturn.canJump[indexOfJump] = [column+1,row+1];
          indexOfJump++;
          cascade(x+2,y+2,'black');
        }
      } else {
        if (checkSpot(x-2,y+2).val && checkSpot(x-1,y+1).colour === 'grey') {
          cascadeReturn.canJump[indexOfJump] = [column-1,row+1];
          indexOfJump++;
          cascade(x-2,y+2,'black');
        }
        if (checkSpot(x+2,y+2).val && checkSpot(x+1,y+1).colour === 'grey') {
          cascadeReturn.canJump[indexOfJump] = [column+1,row+1];
          indexOfJump++;
          cascade(x+2,y+2,'black');
        }
      }
      break;
    }
}

function fullCascadeCheck(column,row,colour) {
  switch (colour) {
    case 'grey':
      if (column === 1) {
        if (checkSpot(column+1,row-1).val) {

        } else if (checkSpot(column+2,row-2).val && !(checkSpot(column+1,row-1).colour === 'grey')) {
          cascadeReturn.canJump[indexOfJump] = [column+1,row-1];
          indexOfJump++;
          cascade(column+2,row-2,'grey');
        }
      } else if (column === 8) {
        if (checkSpot(column-1,row-1).val) {

        } else if (checkSpot(column-2,row-2).val && !(checkSpot(column-1,row-1).colour === 'grey')) {
          cascadeReturn.canJump[indexOfJump] = [column-1,row-1];
          indexOfJump++;
          cascade(column-2,row-2,'grey');
        }
      } else {
        if (checkSpot(column-1,row-1).val) {

        } else if (checkSpot(column-2,row-2).val && !(checkSpot(column-1,row-1).colour === 'grey')) {
          cascadeReturn.canJump[indexOfJump] = [column-1,row-1];
          indexOfJump++;
          cascade(column-2,row-2,'grey');
        }
        if (checkSpot(column+1,row-1).val) {

        } else if (checkSpot(column+2,row-2).val && !(checkSpot(column-1,row-1).colour === 'grey')) {
          cascadeReturn.canJump[indexOfJump] = [column+1,row-1];
          indexOfJump++;
          cascade(column+2,row-2,'grey');
        }
      }
      break;
    case 'black':
      if (column === 8) {
        if (checkSpot(column-1,row+1).val) {

        } else if (checkSpot(column-2,row+2).val && !(checkSpot(column-1,row+1).colour === 'black')) {
          cascadeReturn.canJump[indexOfJump] = [column-1,row+1];
          indexOfJump++;
          cascade(column-2,row+2,'black');
        }
      } else if (column === 1) {
        if (checkSpot(column+1,row+1).val) {

        } else if (checkSpot(column+2,row+2).val && !(checkSpot(column+1,row+1).colour === 'black')) {
          cascadeReturn.canJump[indexOfJump] = [column+1,row+1];
          indexOfJump++;
          cascade(column+2,row+2,'black');
        }
      } else {
        if (checkSpot(column-1,row+1).val) {

        } else if (checkSpot(column-2,row+2).val && !(checkSpot(column-1,row+1).colour === 'black')) {
          cascadeReturn.canJump[indexOfJump] = [column-1,row+1]
          indexOfJump++;
          cascade(column-2,row+2,'black');
        }
        if (checkSpot(column+1,row+1).val) {

        } else if (checkSpot(column+2,row+2).val && !(checkSpot(column+1,row+1).colour === 'black')) {
          cascadeReturn.canJump[indexOfJump] = [column+2,row+2]
          indexOfJump++;
          cascade(column+2,row+2,'black');
        }
      }
      break;
    }
  indexOfJump = 0;
  return cascadeReturn;
}

function disableSpot(x,y) {
  $('[data-column='+JSON.stringify(x)+'][data-row='+JSON.stringify(y)+']')
  .removeClass('yellow')
  .addClass('red');
}

function disableAllSpots() {
  for (var i = 1; i <= 8; i++) {
    for (var o = 1; o <= 8; o++) {
      disableSpot(i,o);
    }
  }
}

function setBoard() {
  setPlayer('grey');
  deleteAllChecker();
  generateChecker(1,1,['black','checker']);
  generateChecker(3,1,['black','checker']);
  generateChecker(5,1,['black','checker']);
  generateChecker(7,1,['black','checker']);

  generateChecker(2,2,['black','checker']);
  generateChecker(4,2,['black','checker']);
  generateChecker(6,2,['black','checker']);
  generateChecker(8,2,['black','checker']);

  generateChecker(1,3,['black','checker']);
  generateChecker(3,3,['black','checker']);
  generateChecker(5,3,['black','checker']);
  generateChecker(7,3,['black','checker']);


  generateChecker(2,6,['grey','checker']);
  generateChecker(4,6,['grey','checker']);
  generateChecker(6,6,['grey','checker']);
  generateChecker(8,6,['grey','checker']);

  generateChecker(1,7,['grey','checker']);
  generateChecker(3,7,['grey','checker']);
  generateChecker(5,7,['grey','checker']);
  generateChecker(7,7,['grey','checker']);

  generateChecker(2,8,['grey','checker']);
  generateChecker(4,8,['grey','checker']);
  generateChecker(6,8,['grey','checker']);
  generateChecker(8,8,['grey','checker']);

  togglePlayer();
  disableAllChecker();
  console.clear();
}
