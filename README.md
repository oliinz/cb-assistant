# Cryptoblades.io extension for determining likelihood of winning

A chrome extension that assists in cryptoblades combat.

## Installation and usage

From <https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest>:

>![Image describing the process](https://developer-chrome-com.imgix.net/image/BhuKGJaIeLNPW9ehns59NfwqKxF2/vOu7iPbaapkALed96rzN.png?w=571 "Image from the link above")
>
> 1. Open the Extension Management page by navigating to chrome://extensions.
> 2. Alternatively, open this page by clicking on the Extensions menu button and selecting Manage Extensions at the bottom of the menu.
> 3. Alternatively, open this page by clicking on the Chrome menu, hovering over More Tools then selecting Extensions
> 4. Enable Developer Mode by clicking the toggle switch next to Developer mode.
> Click the Load unpacked button and select the extension directory.

From the explorer, select the "src" folder. It should now be in your browser's extension menu. Pin it for quick acces.

To use the extension, head to the cb [combat page](https://app.cryptoblades.io/#/combat), select a weapon, wait for the enemy cards to show up, then click the extension icon once to show the weapon tooltip. Click again to finally run (1000) battle simulations. Percentages indicating how much wins your character made in the course of 1000 battles will replace the text on the fight buttons.

![Image of modified combat screen with percentages](https://picc.io/CKLMgYW.png)
*I rarely see results greater than 90%, and never 100%*

## TODO

- Gather data on reliability of results

## Known bugs

- Values calculated and shown before clicking fight button are still present after fight has finished.
- Simulated probability not same as other tools?

## Computation

The extension runs 1000 battle simulations and shows percentage of wins.
I applied the formula found [here](https://media.discordapp.net/attachments/856908629612560464/868132463552135218/219627866_1236978556754654_6526931600978395474_n.png). ![Image of math formula used to generate rolls](https://media.discordapp.net/attachments/856908629612560464/868132463552135218/219627866_1236978556754654_6526931600978395474_n.png)

Seems to work okay but further testing is needed.

## License

This open source & free software is under [GplV3.](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Report bugs

To report bugs, go to github repo, or message me @ liinz(#)0821
