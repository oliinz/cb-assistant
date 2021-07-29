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

   trait = trait.className;
   return trait.slice(0, trait.length-5);
};

let weapTrait = getWeapTrait();
// console.log(weapTrait) // str, 'water', 'fire'

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

// find bonus power, default to 0

let bonusPower = getBonusPower()
// console.log(bonusPower) // Int

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

// find weapon stats trait

let weapStats = getAllWeapStats()
// console.log(weapStats) // Array of arrays, [[stats], [powers]]

function getEnemyTrait(enemyCount) {
   let trait = document.querySelector(`body > div > div.content.dark-bg-text > div > div > div:nth-child(3) > div > \
   div.combat-enemy-container > div.row.mb-3.flex-column.enemy-container > div.enemy-list > \
   div:nth-child(${enemyCount}) > div > div.enemy-character > div.encounter-element > span`);
   trait = trait.className
   return trait.slice(0, trait.length-5);
};

function getEnemyPower(enemyCount) {
   let power = document.querySelector(`body > div.app > div.content.dark-bg-text > div > div > div:nth-child(3) > \
   div > div.combat-enemy-container > div.row.mb-3.flex-column.enemy-container > div.enemy-list > \
   div:nth-child(${enemyCount}) > div > div.enemy-character > div.encounter-power`).textContent;
   return Number(power.slice(0, power.length-6))
};

// find enemy traits

let enemyTraits = []; // [Strs], ['water', 'fire', 'lighting']
let enemyPowers = []; // [Ints], [2344, 8443, 2333]

for (let i = 0; i < 4; i++) {
   enemyTraits.push(getEnemyTrait(i+1))
   enemyPowers.push(getEnemyPower(i+1))
}

// Define each element's strength and weakness

const elementMatchups = {
   // Element: [Strength, Weakness]
   fire: ["earth", "water"],
   earth: ["lightning", "fire"],
   lightning: ["water", "earth"],
   water: ["fire", "lightning"]
}

function getWeaponPower() {
   // Loops through the weapon's stats

   let weaponPower = 1;
   let m;
   for (let i = 0; i < 3; i++) {
      let weaponTrait = weapStats[0][i] // str of trait
      let weaponStat = weapStats[1][i]  // int of stat power
      if ( weaponStat === undefined ) { weaponStat = 0} // should this be 0?

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
   // Generate roll for hero and enemies. Return array of rolls

   let weaponPower = getWeaponPower();
   let traitBonus = 0;
   let enemyRolls = []
   let heroRolls = [];

   let weapTraitBonus = 0
   if (heroTrait === weapTrait) weapTraitBonus = 0.075;

   function rng(min, max) { // min inclusive, max exclusive
      return (Math.round((Math.random() * (max-min) + min))) * .01
   }

   for (let i = 0; i < 4; i++) {
      let enemyTrait = enemyTraits[i] 
      let enemyPower = enemyPowers[i]

      // get trait bonus by looking up strength and weakness from 
      // traitHeirarchy object

      // hero trait is strong against enemy trait
      if (elementMatchups[heroTrait][0] === enemyTrait) traitBonus += 0.075

      // hero trait is weak against enemy trait
      else if (elementMatchups[heroTrait][1] === enemyTrait) traitBonus -= 0.075

      traitBonus = weapTraitBonus + traitBonus

      // Get enemy and player roll

      enemyRolls.push((enemyPower + (enemyPower * rng(-10, 10) )))

      let power = (weaponPower * heroPower + bonusPower)
      let roll = (power + ( power * rng(-10, 10))) * (1 + traitBonus)

      heroRolls.push(roll)

      traitBonus = 0

   }

   return [heroRolls, enemyRolls];
}

function getPercentages() {

   // Each array item represents an enemy
   let totalWins = [0, 0, 0, 0] 

   for (let i =0; i <= 1000; i++){
   // for (let i = 0; i < 1; i++){ // for debug
      let battleResult = simulateBattle()      

      for (let j = 0; j < 4; j++) {
         if ((battleResult[0][j] - battleResult[1][j]) > 0) {
            totalWins[j]++
         }
      }
   }
   return [totalWins[0]/10, totalWins[1]/10, totalWins[2]/10,totalWins[3]/10] // divide to get under 100
}

// Get percentage of win out of 1000 battles
let winPercs = getPercentages() 

function showEnemyPerc(enemyCount, value) {
   let fightButton = document.querySelector(`body > div.app > div.content.dark-bg-text \
   > div > div > div:nth-child(3) > div > div.combat-enemy-container > \
   div.row.mb-3.flex-column.enemy-container > div.enemy-list > div:nth-child(${enemyCount}) > div > button > h1`)
   
   fightButton.textContent = `${Math.round(value)}%`
}

// replace 'Fight!' with the percentages
for (let i = 0; i < 4; i++) {
   showEnemyPerc(i+1, winPercs[i])  // site is 1-index
}
})() 