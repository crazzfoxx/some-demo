///////变量声明/////////
var wrapper = document.getElementById('wrapper');

//weaponArea packArea//
var weaponArea = document.getElementById('weapon-area');
var weaponList = weaponArea.getElementsByClassName('weapon-list')[0];
var weaponLoad = weaponArea.getElementsByClassName('load')[0];
var packArea = document.getElementById('pack-area');
var packList = packArea.getElementsByClassName('pack-list')[0];
var packLoad = packArea.getElementsByClassName('load')[0];

//weaponArea packArea//

//gameArea//
var gameArea = document.getElementById('game-area');

var cardArea = gameArea.getElementsByClassName('card-area')[0];
var cards = cardArea.getElementsByClassName('card');

//infoArea
var infoArea = gameArea.getElementsByClassName('info-area')[0];
var equipmentSlots = infoArea.getElementsByClassName('equipment')[0].getElementsByTagName('div');
var info_show = infoArea.getElementsByClassName('show')[0];
var info_text = infoArea.getElementsByClassName('text')[0];

//infoArea

var stateArea = gameArea.getElementsByClassName('state-area')[0];

var overallhealth = stateArea.getElementsByClassName('overallhealth')[0];
var overallhealthGraphic = overallhealth.children[0];
var healthState = stateArea.getElementsByClassName('health')[0];

var battleState = stateArea.getElementsByClassName('battle')[0];

var timecount = stateArea.getElementsByClassName('timecount')[0];
var nukacola = stateArea.getElementsByClassName('nukacola')[0];
var loadingBar = stateArea.getElementsByClassName('loading-bar')[0];
var overall = stateArea.getElementsByClassName('overall')[0];
var dayRecord = loadingBar.getElementsByTagName('strong')[0];

//gameArea//

//lootArea//
var lootArea = document.getElementById('loot-area');
var lootList = lootArea.getElementsByClassName('loot-list')[0];
var items = lootList.getElementsByClassName('item');
//lootArea//

//rightClickMenu// 
var rightClickMenu = document.getElementsByClassName('rightClickMenu')[0];
var pick = rightClickMenu.children[0].children[0];
var use = rightClickMenu.children[0].children[1];
var equip = rightClickMenu.children[0].children[2];
var takeoff = rightClickMenu.children[0].children[3];
var drop = rightClickMenu.children[0].children[4];
//rightClickMenu// 

//eventLayer
var eventLayer = document.getElementsByClassName('event-layer')[0];
var eventBox = eventLayer.children[0];
var eventShow = eventBox.getElementsByClassName('event-show')[0];
var eventText = eventBox.getElementsByClassName('text')[0];
var eventConfirm = eventBox.getElementsByClassName('event-confirm')[0];
var eventLeave = eventBox.getElementsByClassName('event-leave')[0];
var eventRefuse = eventBox.getElementsByClassName('event-refuse')[0];

//eventLayer