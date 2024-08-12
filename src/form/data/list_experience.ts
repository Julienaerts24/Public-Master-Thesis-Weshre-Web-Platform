function generateExperienceList(t: any) {
    return  [
        {key: 'artExhibition', title: t('artExhibition'), group: "art", groupTitle: t('art'), icon: "🗽"},
        {key: 'artMuseum', title: t('artMuseum'), group: "art", groupTitle: t('art'), icon: "📜"},
        {key: 'otherArt', title: t('other'), group: "art", groupTitle: t('art'), icon: "🎨"},
        {key: 'dogWalking', title: t('dogWalking'), group: "animal", groupTitle: t('animal'), icon: "🐕"},
        {key: 'fishing', title: t('fishing'), group: "animal", groupTitle: t('animal'), icon: "🎣"},
        {key: 'horseRiding', title: t('horseRiding'), group: "animal", groupTitle: t('animal'), icon: "🏇"},
        {key: 'otherAnimal', title: t('other'), group: "animal", groupTitle: t('animal'), icon: "🐾"},
        {key: 'cooking', title: t('cooking'), group: "food", groupTitle: t('food'), icon: "🍳"},
        {key: 'foodDrinkTasting', title: t('foodDrinkTasting'), group: "food", groupTitle: t('food'), icon: "🍷"},
        {key: 'breakfast', title: t('breakfast'), group: "food", groupTitle: t('food'), icon: "🥐"},
        {key: 'brunch', title: t('brunch'), group: "food", groupTitle: t('food'), icon: "🥞"},
        {key: 'lunch', title: t('lunch'), group: "food", groupTitle: t('food'), icon: "🥪"},
        {key: 'picnic', title: t('picnic'), group: "food", groupTitle: t('food'), icon: "🧺"},
        {key: 'dinner', title: t('dinner'), group: "food", groupTitle: t('food'), icon: "🍽"},
        {key: 'otherFood', title: t('other'), group: "food", groupTitle: t('food'), icon: "🍴"},
        {key: 'museum', title: t('museum'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🏛"},
        {key: 'talkDebates', title: t('talkDebates'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🎙"},
        {key: 'comedy', title: t('comedy'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🤡"},
        {key: 'circus', title: t('circus'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🎪"},
        {key: 'movie', title: t('movie'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🎬"},
        {key: 'sportingEvent', title: t('sportingEvent'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "⚽"},
        {key: 'theater', title: t('theater'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🎭"},
        {key: 'otherCultureScience', title: t('other'), group: "cultureScience", groupTitle: t('cultureScience'), icon: "🔬"},
        {key: 'boardGame', title: t('boardGame'), group: "gaming", groupTitle: t('gaming'), icon: "🎲"},
        {key: 'cardGame', title: t('cardGame'), group: "gaming", groupTitle: t('gaming'), icon: "🃏"},
        {key: 'rolePlayingGame', title: t('rolePlayingGame'), group: "gaming", groupTitle: t('gaming'), icon: "🗡"},
        {key: 'videoGame', title: t('videoGame'), group: "gaming", groupTitle: t('gaming'), icon: "🎮"},
        {key: 'otherGaming', title: t('other'), group: "gaming", groupTitle: t('gaming'), icon: "🧩"}
      ];
  }
  export { generateExperienceList };