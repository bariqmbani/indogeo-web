# indogeo-web

Simple Indonesia Province Game using Vue 3 and Leaflet.
Game inspired by [playGeography](https://www.playgeography.com/).

Thanks for @ardian28 for sharing the [Indonesia's GeoJSON data](https://github.com/ardian28/GeoJson-Indonesia-38-Provinsi/tree/main).

## Description

This simple mini game currently only contains the single page of main gameplay. There are 3 main components: navbar, map, and the question card.
The navbar contains info for the game progress such as timer and score.

## Gameplay

- Start the game by clicking the button on the middle of the page.
- The timer will start counting and the question will appear on top middle of the page.
- Game will start with maximum score (100) and will have 15 questions.
- Every question will have maximum 3 guess attempt.
- Each wrong guess will decrease score by 5.
- If all of guesses are wrong, after reach maximum attempt, it will go to the next question.
- If the guess is correct, then the score won't decrease and it will also go to the next question.

## Improvements & Future Plan

- Add Main Menu page.
- Add Game Over information and page.
- Add highlight or outline (info like visual) to the map feature if the guess is wrong.
- Prevent same question appear in one game run.
- Possibly add the separated backend app for leaderboard feature and store the geoJSON to DB.
- Also add city game type for each province.
