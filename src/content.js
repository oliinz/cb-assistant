// Immediately invoked fucntion
(() => {

// Find hero trait
let heroTrait = document.querySelector('body > div > div.character-bar > div > \
 div.root.main-font > div.character-data-column.dark-bg-text > span.name.bold.character-name > span').classList[0];
heroTrait = heroTrait.slice(0, heroTrait.length-5); 
// console.log(heroTrait) // str, 'water', 'fire'

// find hero power
let heroPower = (document.querySelector('body > div > div.character-bar > div \
 > div.root.main-font > div.character-data-column.dark-bg-text > span.subtext.subtext-stats > span:nth-child(4)').textContent);
heroPower = Number(heroPower.replaceAll(',', '')); 
// console.log(heroPower) // int

// find weapon trait 
function getWeapTrait() {
   let trait = document.querySelector("body > div.app > \
   div.content.dark-bg-text > div > div > div:nth-child(3) > div > div.combat-enemy-container > \
   div.col.weapon-selection > div:nth-child(2) > div > div > div > div.trait > span");

   trait = trait.className
   return trait.slice(0, trait.length-5);
};

let weapTrait = getWeapTrait() 
// console.log(weapTrait) // str, 'water', 'fire'

// find bonus power, default to 0
function getBonusPower() {
   let weapon = document.querySelector("body > div > div.content.dark-bg-text > \
   div > div > div > div > div.combat-enemy-container > div.col.weapon-selection > \
   div > div > div > div")
   let event = new MouseEvent('mouseenter', { 
      'view': window,
      'bubbles': true,
      'cancelable': true
   });

   weapon.dispatchEvent(event); // Send fake hover to show tooltip

   let tooltipId = document.querySelector(".weapon-icon.has-tooltip").getAttribute('aria-describedby')
   let tooltipText = document.getElementById(tooltipId).textContent

   try {
      let power = Number(/Bonus power: (\d)*/.exec(tooltipText)[0].slice(13, )) 
      return power
      
   } catch (error) {
      return 0
   };
};

let bonusPower = getBonusPower()
// console.log(bonusPower) // Int
// find weapon stats trait

function getAllWeapStats() {
   let statsDiv = document.querySelector("body > div > div.content.dark-bg-text > \
   div > div > div:nth-child(3) > div > div.combat-enemy-container > \
   div.col.weapon-selection > div:nth-child(2) > div > div > div.stats")
   let stats = statsDiv.querySelectorAll("span:not(.icon)") 
   let statTraits = []
   let statPowers = []
   for (stat of stats ) {
      let statTrait = stat.textContent.slice(0, 3)
      let statPower = Number(stat.textContent.slice(5, 9))
      switch (statTrait) {
         case 'PWR': 
            statTrait = 'power';
            break;
         case 'STR': 
            statTrait = 'fire';
            break;
         case 'DEX': 
            statTrait = 'earth';
            break;
         case 'CHA': 
            statTrait = 'lightning';
            break;
         case 'INT': 
            statTrait = 'water';
            break;
  }
      statTraits.push(statTrait)
      statPowers.push(statPower)
   } 
   return [statTraits, statPowers]
}
let weapStats = getAllWeapStats()
// console.log(weapStats) // Array of arrays, [[stats], [powers]]

// find enemy traits
function getEnemyTrait(enemyCount) {
   let trait = document.querySelector(`body > div > div.content.dark-bg-text > div > div > div:nth-child(3) > div > div.combat-enemy-container > div.row.mb-3.flex-column.enemy-container > div.enemy-list > \
   div:nth-child(${enemyCount}) > div > div.enemy-character > div.encounter-element > span`);
   trait = trait.className
   return trait.slice(0, trait.length-5);
};

function getEnemyPower(enemyCount) {
   let power = document.querySelector(`body > div.app > div.content.dark-bg-text > div > div > div:nth-child(3) > div > div.combat-enemy-container > div.row.mb-3.flex-column.enemy-container > div.enemy-list > \
   div:nth-child(${enemyCount}) > div > div.enemy-character > div.encounter-power`).textContent;
   return Number(power.slice(0, power.length-6))
};

let enemyTraits = [];
let enemyPowers = [];

for (let i = 0; i < 4; i++) {
   enemyTraits.push(getEnemyTrait(i+1))
   enemyPowers.push(getEnemyPower(i+1))
}

// console.log(enemyTraits) // [Strs], ['water', 'fire', 'lighting']
// console.log(enemyPowers) // [Ints], [2344, 8443, 2333]

// Compute, generate random roll for each enemy
const traitHeirarchy = {
   // Element: [Strength, Weakness]
   fire: ["earth", "water"],
   earth: ["lightning", "fire"],
   lightning: ["water", "earth"],
   water: ["fire", "lightning"]
}

function getWeaponPower() {
   let weaponPower = 1;
   let m;
   for (let i = 0; i < 3; i++) {
      let weaponTrait = weapStats[0][i] // str of trait
      let weaponStat = weapStats[1][i]  // int of stat power
      if ( weaponStat === undefined ) { weaponStat = 0}

      // get m value
      if (heroTrait === weaponTrait) {
         m = 0.002675
      } else if (weaponTrait === 'power') {
         m = 0.002575
      } else {
         m = 0.0025
      }

      weaponPower += (weaponStat * m)
   }
   return weaponPower;
}

function simulateBattle() {
   let weaponPower = getWeaponPower();
   let traitBonus = 0;
   let enemyRolls = []
   let heroRolls = [];

   let weapTraitBonus = 0
   if (heroTrait === weapTrait) {weapTraitBonus += 0.075}

   function rng(min, max) { // min inclusive, max exclusive
      return Math.floor((Math.random() * (max-min) + min))
      // if ((Math.floor((Math.random()) *100)) %2 === 0) {return -10} 
      // return 10
   }

   for (let i = 0; i < 4; i++) {
      let enemyTrait = enemyTraits[i] 
      let enemyPower = enemyPowers[i]

      // get trait bonus, lookup elements

      if (traitHeirarchy[heroTrait][0] === enemyTrait) { // hero trait is > enemy trait
         traitBonus += 0.075
      } else if (traitHeirarchy[heroTrait][1] === enemyTrait) { 
         traitBonus -= 0.075
      } 

      traitBonus = weapTraitBonus + traitBonus
      // console.log(`${enemyTrait}  ${traitBonus}`)

      // Get enemy and player roll

      enemyRolls.push((enemyPower + (enemyPower * (rng(-10, 11) * .01) )))
      let power = (weaponPower * heroPower + bonusPower)
      heroRolls.push( (power + ( power * (rng(-10, 11)*.01) ) * (1 + traitBonus)))

      traitBonus = 0
   }
   // console.log(heroRolls)
   // console.log(enemyRolls)
   // console.log(  heroRolls[0]-enemyRolls[0], heroRolls[1]-enemyRolls[1],  heroRolls[2]-enemyRolls[2], heroRolls[3]-enemyRolls[3])
   return [heroRolls, enemyRolls];
}

function getPercentages() {
   let totalWins = [0, 0, 0, 0]
   for (let i =0; i <= 1000; i++){
   // for (let i =0; i < 1; i++){
      let battleResult = simulateBattle()      

      for (let j = 0; j < 4; j++) {
         if ((battleResult[0][j] - battleResult[1][j]) > 0) {
            totalWins[j]++
         }
      }
   }
   return [totalWins[0]/10, totalWins[1]/10, totalWins[2]/10,totalWins[3]/10] // divide to get under 100
   // return totalWins // over 1000
}

let winPercs = getPercentages() // returns an array
// console.log(winPercs)


// replace '___ victory' or 'Fight!' with the percentages
function showEnemyPerc(enemyCount, value) {
   let fightButton = document.querySelector(`body > div.app > div.content.dark-bg-text \
   > div > div > div:nth-child(3) > div > div.combat-enemy-container > \
   div.row.mb-3.flex-column.enemy-container > div.enemy-list > div:nth-child(${enemyCount}) > div > button > h1`)
   
   fightButton.textContent = `${value}%`
}
for (let i = 0; i < 4; i++) {
   showEnemyPerc(i+1, winPercs[i])  // site is 1-index
}


})() 

//TODO: Fix the messy code